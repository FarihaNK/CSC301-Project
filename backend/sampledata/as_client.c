
/*****************************************************************************/
#include "as_client.h"


static int connect_to_server(int port, const char *hostname) {
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("connect_to_server");
        return -1;
    }

    struct sockaddr_in addr;

    // Allow sockets across machines.
    addr.sin_family = AF_INET;
    // The port the server will be listening on.
    // htons() converts the port number to network byte order.
    // This is the same as the byte order of the big-endian architecture.
    addr.sin_port = htons(port);
    // Clear this field; sin_zero is used for padding for the struct.
    memset(&(addr.sin_zero), 0, 8);

    // Lookup host IP address.
    struct hostent *hp = gethostbyname(hostname);
    if (hp == NULL) {
        ERR_PRINT("Unknown host: %s\n", hostname);
        return -1;
    }

    addr.sin_addr = *((struct in_addr *) hp->h_addr);

    // Request connection to server.
    if (connect(sockfd, (struct sockaddr *)&addr, sizeof(addr)) == -1) {
        perror("connect");
        return -1;
    }

    return sockfd;
}


/*
** Helper for: list_request
** This function reads from the socket until it finds a network newline.
** This is processed as a list response for a single library file,
** of the form:
**                   <index>:<filename>\r\n
**
** returns index on success, -1 on error
** filename is a heap allocated string pointing to the parsed filename
*/
static int get_next_filename(int sockfd, char **filename)
{
    static int bytes_in_buffer = 0;
    static char buf[RESPONSE_BUFFER_SIZE];

    while((*filename = find_network_newline(buf, &bytes_in_buffer)) == NULL) {
        int num = read(sockfd, buf + bytes_in_buffer,
                       RESPONSE_BUFFER_SIZE - bytes_in_buffer);
        if (num < 0) {
            perror("list_request");
            return -1;
        }
        bytes_in_buffer += num;
        if (bytes_in_buffer == RESPONSE_BUFFER_SIZE) {
            ERR_PRINT("Response buffer filled without finding file\n");
            ERR_PRINT("Bleeding data, this shouldn't happen, but not giving up\n");
            memmove(buf, buf + BUFFER_BLEED_OFF, RESPONSE_BUFFER_SIZE - BUFFER_BLEED_OFF);
        }
    }

    char *parse_ptr = strtok(*filename, ":");
    int index = strtol(parse_ptr, NULL, 10);
    parse_ptr = strtok(NULL, ":");
    // moves the filename to the start of the string (overwriting the index)
    memmove(*filename, parse_ptr, strlen(parse_ptr) + 1);

    return index;
}

int list_request(int sockfd, Library *library)
{
    const char send_line[] = "LIST\r\n";
    if (library == NULL)
    {
        perror("Failed to load library\n");
        return -1;
    }

    ssize_t bytes_written = write_precisely(sockfd, send_line, strlen(send_line));
    if (bytes_written != strlen(send_line))
    {
        perror("Failed sending LIST request to server");
        return -1;
    }
    _free_library(library);
    library->num_files = 0;
    library->files = NULL;

    char *filename = NULL;
    char **temp = NULL;
    char **temp2 = NULL;
    int index=0;

    for(;;)
    {
        index=get_next_filename(sockfd, &filename);
        //  printf("RECIEVED FROM FUNCTION %s, INDEX: %d\n",filename,index);
        if (index==-1)
        {
            break;
        }
        //   printf("file recieved: %s\n", filename);
        temp = realloc(temp2, (library->num_files + 1) * sizeof(char *)); // todo: try malloc instead?
        //printf("ran Loop\n");
        if (temp == NULL) {
            perror("Failed to reallocate memory for library files\n");
            free(filename);
            for (int i = 0; i < library->num_files; i++) {
                free(temp2[i]);
            }
            free(temp2);
            return -1;
        }
        temp2 = temp;
        temp2[library->num_files] = filename;
        library->num_files += 1;
        //     printf("STORED DATA IN TEMP2:%s , Index: %d\n",temp2[library->num_files], library->num_files);
        if (index==0)
        {
            break;
        }

    }

    // printf("LIBRARY SIZE:%d\n",library->num_files);
    library->files = malloc((sizeof(char*)*library->num_files-1));
    for(int i=0; i < library->num_files; i++)
    {
        // printf("RECIEVED DATA IN TEMP2:%s , Index: %d\n",temp2[library->num_files-i], library->num_files-i);
        library->files[i]=temp2[library->num_files-(i+1)];
    }
    for (int i = 0; i < library->num_files; i++)
    {
        printf("%d: %s\n", i, library->files[i]);
    }
    //library->num_files+=1;
    return library->num_files;
}

/*
** Get the permission of the library directory. If the library 
** directory does not exist, this function shall create it.
**
** library_dir: the path of the directory storing the audio files
** perpt:       an output parameter for storing the permission of the 
**              library directory.
**
** returns 0 on success, -1 on error
*/
int get_library_dir_permission(const char *library_dir, mode_t *perpt) {
    struct stat st;

    if (stat(library_dir, &st) == -1) {
        if (errno == ENOENT) {
            if (mkdir(library_dir, 0700) == -1) {
                perror("mkdir");
                return -1;
            }
            if (stat(library_dir, &st) == -1) {
                perror("stat after mkdir");
                return -1;
            }
        } else {
            perror("stat");
            return -1;
        }
    }

    *perpt = st.st_mode & (S_IRWXU | S_IRWXG | S_IRWXO);
    return 0;
}

/*
** Creates any directories needed within the library dir so that the file can be
** written to the correct destination. All directories will inherit the permissions
** of the library_dir.
**
** This function is recursive, and will create all directories needed to reach the
** file in destination.
**
** Destination shall be a path without a leading /
**
** library_dir can be an absolute or relative path, and can optionally end with a '/'
**
*/
static void create_missing_directories(const char *destination, const char *library_dir) {
    char *str_de_tokville = strdup(destination);
    if (str_de_tokville == NULL) {
        perror("create_missing_directories");
        return;
    }

    char *before_filename = strrchr(str_de_tokville, '/');
    if (!before_filename){
        goto free_tokville;
    }

    char *path = malloc(strlen(library_dir) + strlen(destination) + 2);
    if (path == NULL) {
        goto free_tokville;
    } *path = '\0';

    char *dir = strtok(str_de_tokville, "/");
    if (dir == NULL){
        goto free_path;
    }
    strcpy(path, library_dir);
    if (path[strlen(path) - 1] != '/') {
        strcat(path, "/");
    }
    strcat(path, dir);

    // get the permissions of the library dir
    mode_t permissions;
    if (get_library_dir_permission(library_dir, &permissions) == -1) {
        goto free_path;
    }

    while (dir != NULL && dir != before_filename + 1) {
#ifdef DEBUG
        printf("Creating directory %s\n", path);
#endif
        if (mkdir(path, permissions) == -1) {
            if (errno != EEXIST) {
                perror("create_missing_directories");
                goto free_path;
            }
        }
        dir = strtok(NULL, "/");
        if (dir != NULL) {
            strcat(path, "/");
            strcat(path, dir);
        }
    }
    free_path:
    free(path);
    free_tokville:
    free(str_de_tokville);
}


/*
** Helper for: get_file_request
*/
static int file_index_to_fd(uint32_t file_index, const Library * library){
    create_missing_directories(library->files[file_index], library->path);

    char *filepath = _join_path(library->path, library->files[file_index]);
    if (filepath == NULL) {
        return -1;
    }

    int fd = open(filepath, O_WRONLY | O_CREAT | O_TRUNC, 0666);
#ifdef DEBUG
    printf("Opened file %s\n", filepath);
#endif
    free(filepath);
    if (fd < 0 ) {
        perror("file_index_to_fd");
        return -1;
    }

    return fd;
}


int get_file_request(int sockfd, uint32_t file_index, const Library * library){
#ifdef DEBUG
    printf("Getting file %s\n", library->files[file_index]);
#endif

    int file_dest_fd = file_index_to_fd(file_index, library);
    if (file_dest_fd == -1) {
        return -1;
    }

    int result = send_and_process_stream_request(sockfd, file_index, -1, file_dest_fd);
    if (result == -1) {
        return -1;
    }

    return 0;
}
int start_audio_player_process(int *audio_out_fd) {
    // Create a pipe for inter-process communication
    int pipe_descriptors[2];
    if (pipe(pipe_descriptors) < 0) {
        perror("Pipe creation failed");
        return -1;
    }

    // Fork a new process
    pid_t pid = fork();
    if (pid < 0) {
        perror("Forking process failed");
        close(pipe_descriptors[0]);
        close(pipe_descriptors[1]);
        return -1;
    }

    if (pid == 0) { // Child process
        close(pipe_descriptors[1]); // Close the write end in the child

        // Redirect stdin to the read end of the pipe
        if (dup2(pipe_descriptors[0], STDIN_FILENO) < 0) {
            perror("Failed to redirect stdin");
            close(pipe_descriptors[0]);
            exit(EXIT_FAILURE);
        }
        close(pipe_descriptors[0]); // Close the read end after duplicating
        // Execute the audio player with the appropriate arguments
        char *const player_args[] = AUDIO_PLAYER_ARGS;
        execvp(AUDIO_PLAYER, player_args);

        // If execvp fails, exit with an error
        perror("Failed to execute audio player");
        exit(EXIT_FAILURE);
    }

    // Parent process
    close(pipe_descriptors[0]); // Close the read end in the parent

    *audio_out_fd = pipe_descriptors[1]; // Return the write end for audio output

    // Sleep to give the audio player time to start
    sleep(AUDIO_PLAYER_BOOT_DELAY);

    return pid;
}


static void _wait_on_audio_player(int audio_player_pid) {
    int status;
    if (waitpid(audio_player_pid, &status, 0) == -1) {
        perror("_wait_on_audio_player");
        return;
    }
    if (WIFEXITED(status)) {
        fprintf(stderr, "Audio player exited with status %d\n", WEXITSTATUS(status));
    } else {
        printf("Audio player exited abnormally\n");
    }
}


int stream_request(int sockfd, uint32_t file_index) {
    int audio_out_fd;
    int audio_player_pid = start_audio_player_process(&audio_out_fd);

    int result = send_and_process_stream_request(sockfd, file_index, audio_out_fd, -1);
    if (result == -1) {
        ERR_PRINT("stream_request: send_and_process_stream_request failed\n");
        return -1;
    }

    _wait_on_audio_player(audio_player_pid);

    return 0;
}


int stream_and_get_request(int sockfd, uint32_t file_index, const Library * library) {
    int audio_out_fd;
    int audio_player_pid = start_audio_player_process(&audio_out_fd);

#ifdef DEBUG
    printf("Getting file %s\n", library->files[file_index]);
#endif

    int file_dest_fd = file_index_to_fd(file_index, library);
    if (file_dest_fd == -1) {
        ERR_PRINT("stream_and_get_request: file_index_to_fd failed\n");
        return -1;
    }

    int result = send_and_process_stream_request(sockfd, file_index,
                                                 audio_out_fd, file_dest_fd);
    if (result == -1) {
        ERR_PRINT("stream_and_get_request: send_and_process_stream_request failed\n");
        return -1;
    }

    _wait_on_audio_player(audio_player_pid);

    return 0;
}
 /*int max ( int x, int y , int z)
{
    if( x< y)
    {
        if (y<z)
        {
            return z;
        }
        return y;
    }
    if(y<x)
    {
        if(x<z)
        {
            return z;
        }
        return x;
    }
    return 0;
}*/
 int max(int x, int y, int z)
 {
     if (x >= y && x >= z)
     {
         return x;
     }
     else if (y >= x && y >= z)
     {
         return y;
     }
     else
     {
         return z;
     }
 }
/*
int send_and_process_stream_request(int sockfd, uint32_t file_index, int audio_out_fd, int file_dest_fd)
{
    const char stream_Req[] = "STREAM\r\n";

    // Send STREAM request
    if (write(sockfd, stream_Req, strlen(stream_Req)) != (ssize_t)strlen(stream_Req))
    {
        perror("Error sending stream Request");
        return -1;
    }

    // Send FILE INDEX
    uint32_t index_n_size = htonl(file_index);
    if (write(sockfd, &index_n_size, sizeof(index_n_size)) != sizeof(index_n_size))
    {
        perror("Error sending file index");
        return -1;
    }

    // Read FILE SIZE
    uint32_t networkFileSize = 0;
    if (read(sockfd, &networkFileSize, sizeof(networkFileSize)) != sizeof(networkFileSize))
    {
        perror("Error reading file size");
        return -1;
    }
    int file_size = ntohl(networkFileSize);

    // Set up select and buffer
    struct timeval time;
    time.tv_sec = SELECT_TIMEOUT_SEC;
    time.tv_usec = SELECT_TIMEOUT_USEC;

    // Initial buffer allocation
    int buffer_size = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
    char* dynamicBuffer = malloc(buffer_size);
    if (!dynamicBuffer)
    {
        perror("Failed to allocate buffer");
        return -1;
    }

    int bytes_saved = 0;  // Bytes read from socket
    int bytes_written = 0; // Bytes written to client
    int file_bytes = 0;    // Bytes written to file

    while (bytes_saved < file_size || bytes_written < file_size)
    {
        printf("Bytes saved: %d\n",bytes_saved);
        printf("bytes Written: %d\n", bytes_written);
        int max_fd = max(audio_out_fd, sockfd, file_dest_fd);
        fd_set cread_fds, cwrite_fds;
        FD_ZERO(&cread_fds);
        FD_ZERO(&cwrite_fds);

        FD_SET(sockfd, &cread_fds);
        if (audio_out_fd != -1)
            FD_SET(audio_out_fd, &cwrite_fds);
        if (file_dest_fd != -1)
            FD_SET(file_dest_fd, &cwrite_fds);

        int result = select(max_fd + 1, &cread_fds, &cwrite_fds, NULL, &time);
        if (result == -1)
        {
            perror("Error in select statement");
            free(dynamicBuffer);
            return -1;
        }
        if (result == 0)
        {
            continue; // Timeout, retry
        }

        // Reading from socket
        if (FD_ISSET(sockfd, &cread_fds))
        {
            ssize_t bytes_to_read = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
            if (bytes_saved + bytes_to_read > file_size)
                bytes_to_read = file_size - bytes_saved;

            char store_chunk[bytes_to_read];  // Temporary buffer to hold the incoming data
            ssize_t read_chunk = read(sockfd, store_chunk, bytes_to_read);
            if (read_chunk <= 0)
            {
                perror("Error reading data chunk");
                free(dynamicBuffer);
                return -1;
            }

            // Update buffer size if needed
            if (bytes_saved + read_chunk > buffer_size)
            {
                // Move data to a temporary buffer before realloc
                char temp_buffer[bytes_saved];
                memmove(temp_buffer, dynamicBuffer, bytes_saved);

                char* temp_realloc = realloc(dynamicBuffer, bytes_saved + read_chunk);
                if (temp_realloc == NULL)
                {
                    perror("Error dynamically increasing buffer");
                    free(dynamicBuffer);
                    return -1;
                }
                dynamicBuffer = temp_realloc;
                buffer_size = bytes_saved + read_chunk;

                // Move data back to the reallocated buffer
                memmove(dynamicBuffer, temp_buffer, bytes_saved);
            }

            // Copy the read data from store_chunk into dynamicBuffer at the correct offset
            memmove(dynamicBuffer + bytes_saved, store_chunk, read_chunk);
            bytes_saved += read_chunk;
        }

        // Writing to audio output
        if ( FD_ISSET(audio_out_fd, &cwrite_fds))
        {
            ssize_t write_chunk = write(audio_out_fd, dynamicBuffer + bytes_written, bytes_saved - bytes_written);
            if (write_chunk < 0)
            {
                perror("Error sending data chunk to client");
                free(dynamicBuffer);
                return -1;
            }
            bytes_written += (int)write_chunk;
        }

        // Writing to file
        if ( FD_ISSET(file_dest_fd, &cwrite_fds))
        {
            ssize_t write_chunk = write(file_dest_fd, dynamicBuffer + file_bytes, bytes_saved - file_bytes);
            if (write_chunk < 0)
            {
                perror("Error sending data chunk to file");
                free(dynamicBuffer);
                return -1;
            }
            file_bytes += (int)write_chunk;
        }
    }

    if (audio_out_fd != -1) close(audio_out_fd);
    if (file_dest_fd != -1) close(file_dest_fd);
    free(dynamicBuffer);
    return 0;
}*/

int send_and_process_stream_request(int sockfd, uint32_t file_index, int audio_out_fd, int file_dest_fd)
{
    const char stream_Req[] = "STREAM\r\n";

    // Send STREAM request
    if (write(sockfd, stream_Req, strlen(stream_Req)) != (ssize_t)strlen(stream_Req))
    {
        perror("Error sending stream Request");
        return -1;
    }

    // Send FILE INDEX
    uint32_t index_n_size = htonl(file_index);
    if (write(sockfd, &index_n_size, sizeof(index_n_size)) != sizeof(index_n_size))
    {
        perror("Error sending file index");
        return -1;
    }

    // Read FILE SIZE
    uint32_t networkFileSize = 0;
    if (read(sockfd, &networkFileSize, sizeof(networkFileSize)) != sizeof(networkFileSize))
    {
        perror("Error reading file size");
        return -1;
    }
    int file_size = ntohl(networkFileSize);

    // Set up select and buffer
    struct timeval time;
    time.tv_sec = SELECT_TIMEOUT_SEC;
    time.tv_usec = SELECT_TIMEOUT_USEC;

    // Initial buffer allocation
    int buffer_size = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
    char* dynamicBuffer = malloc(buffer_size);
    if (!dynamicBuffer)
    {
        perror("Failed to allocate buffer");
        return -1;
    }

    int bytes_saved = 0;  // Bytes read from socket
    int bytes_written= 0; // Bytes written to client
    int file_bytes = 0;    // Bytes written to file

    fd_set cread_fds, cwrite_fds;

    if(file_dest_fd != -1 && audio_out_fd ==-1)
    {
        //fd_set cread_fds, cwrite_fds;
        while (bytes_saved < file_size || file_bytes < file_size)
        {
            int max_fd = max(audio_out_fd, sockfd, file_dest_fd);
            FD_ZERO(&cread_fds);
            FD_ZERO(&cwrite_fds);

            FD_SET(sockfd, &cread_fds);
            if (audio_out_fd != -1)
                FD_SET(audio_out_fd, &cwrite_fds);
            if (file_dest_fd != -1)
                FD_SET(file_dest_fd, &cwrite_fds);

            int result = select(max_fd + 1, &cread_fds, &cwrite_fds, NULL, &time);
            if (result == -1)
            {
                perror("Error in select statement");
                free(dynamicBuffer);
                return -1;
            }
            if (result == 0)
            {
                continue; // Timeout, retry
            }

            // Reading from socket
            if (FD_ISSET(sockfd, &cread_fds))
            {
                ssize_t bytes_to_read = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
                if (bytes_saved + bytes_to_read > file_size)
                    bytes_to_read = file_size - bytes_saved;

                char store_chunk[bytes_to_read];  // Temporary buffer to hold the incoming data
                ssize_t read_chunk = read(sockfd, store_chunk, bytes_to_read);
                if (read_chunk <= 0)
                {
                    perror("Error reading data chunk");
                    free(dynamicBuffer);
                    return -1;
                }

                // Update buffer size if needed
                if (bytes_saved + read_chunk > buffer_size)
                {
                    // Move data to a temporary buffer before realloc
                    char temp_buffer[bytes_saved];
                    memmove(temp_buffer, dynamicBuffer, bytes_saved);

                    char* temp_realloc = realloc(dynamicBuffer, bytes_saved + read_chunk);
                    if (temp_realloc == NULL)
                    {
                        perror("Error dynamically increasing buffer");
                        free(dynamicBuffer);
                        return -1;
                    }
                    dynamicBuffer = temp_realloc;
                    buffer_size = bytes_saved + read_chunk;

                    // Move data back to the reallocated buffer
                    memmove(dynamicBuffer, temp_buffer, bytes_saved);
                }

                // Copy the read data from store_chunk into dynamicBuffer at the correct offset
                memmove(dynamicBuffer + bytes_saved, store_chunk, read_chunk);
                bytes_saved += read_chunk;
            }

            // Writing to audio output
            if ( audio_out_fd != -1 && FD_ISSET(audio_out_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(audio_out_fd, dynamicBuffer + bytes_written, bytes_saved - bytes_written);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to client");
                    free(dynamicBuffer);
                    return -1;
                }
                bytes_written += (int)write_chunk;
            }

            // Writing to file
            if (file_dest_fd!= -1 &&  FD_ISSET(file_dest_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(file_dest_fd, dynamicBuffer + file_bytes, bytes_saved - file_bytes);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to file");
                    free(dynamicBuffer);
                    return -1;
                }
                file_bytes += (int)write_chunk;
            }
        }

    }
    if( audio_out_fd!= -1 && file_dest_fd == -1)
    {
        while (bytes_saved < file_size || bytes_written < file_size)
        {
            int max_fd = max(audio_out_fd, sockfd, file_dest_fd);
          //  fd_set cread_fds, cwrite_fds;
            FD_ZERO(&cread_fds);
            FD_ZERO(&cwrite_fds);

            FD_SET(sockfd, &cread_fds);
            if (audio_out_fd != -1)
                FD_SET(audio_out_fd, &cwrite_fds);
            if (file_dest_fd != -1)
                FD_SET(file_dest_fd, &cwrite_fds);

            int result = select(max_fd + 1, &cread_fds, &cwrite_fds, NULL, &time);
            if (result == -1)
            {
                perror("Error in select statement");
                free(dynamicBuffer);
                return -1;
            }
            if (result == 0)
            {
                continue; // Timeout, retry
            }

            // Reading from socket
            if (FD_ISSET(sockfd, &cread_fds))
            {
                ssize_t bytes_to_read = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
                if (bytes_saved + bytes_to_read > file_size)
                    bytes_to_read = file_size - bytes_saved;

                char store_chunk[bytes_to_read];  // Temporary buffer to hold the incoming data
                ssize_t read_chunk = read(sockfd, store_chunk, bytes_to_read);
                if (read_chunk <= 0)
                {
                    perror("Error reading data chunk");
                    free(dynamicBuffer);
                    return -1;
                }

                // Update buffer size if needed
                if (bytes_saved + read_chunk > buffer_size)
                {
                    // Move data to a temporary buffer before realloc
                    char temp_buffer[bytes_saved];
                    memmove(temp_buffer, dynamicBuffer, bytes_saved);

                    char* temp_realloc = realloc(dynamicBuffer, bytes_saved + read_chunk);
                    if (temp_realloc == NULL)
                    {
                        perror("Error dynamically increasing buffer");
                        free(dynamicBuffer);
                        return -1;
                    }
                    dynamicBuffer = temp_realloc;
                    buffer_size = bytes_saved + read_chunk;

                    // Move data back to the reallocated buffer
                    memmove(dynamicBuffer, temp_buffer, bytes_saved);
                }

                // Copy the read data from store_chunk into dynamicBuffer at the correct offset
                memmove(dynamicBuffer + bytes_saved, store_chunk, read_chunk);
                bytes_saved += read_chunk;
            }

            // Writing to audio output
            if ( audio_out_fd!= -1 && FD_ISSET(audio_out_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(audio_out_fd, dynamicBuffer + bytes_written, bytes_saved - bytes_written);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to client");
                    free(dynamicBuffer);
                    return -1;
                }
                bytes_written += (int)write_chunk;
            }

            // Writing to file
            if (file_dest_fd!= -1 && FD_ISSET(file_dest_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(file_dest_fd, dynamicBuffer + file_bytes, bytes_saved - file_bytes);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to file");
                    free(dynamicBuffer);
                    return -1;
                }
                file_bytes += (int)write_chunk;
            }
        }

    }

    if( audio_out_fd!= -1 && file_dest_fd != -1)
    {
        while (bytes_saved < file_size || file_bytes < file_size|| bytes_written < file_size)
        {
            int max_fd = max(audio_out_fd, sockfd, file_dest_fd);
          //fd_set cread_fds, cwrite_fds;
            FD_ZERO(&cread_fds);
            FD_ZERO(&cwrite_fds);

            FD_SET(sockfd, &cread_fds);
            if (audio_out_fd != -1)
                FD_SET(audio_out_fd, &cwrite_fds);
            if (file_dest_fd != -1)
                FD_SET(file_dest_fd, &cwrite_fds);

            int result = select(max_fd + 1, &cread_fds, &cwrite_fds, NULL, &time);
            if (result == -1)
            {
                perror("Error in select statement");
                free(dynamicBuffer);
                return -1;
            }
            if (result == 0)
            {
                continue; // Timeout, retry
            }

            // Reading from socket
            if (FD_ISSET(sockfd, &cread_fds))
            {
                ssize_t bytes_to_read = NETWORK_PRE_DYNAMIC_BUFF_SIZE;
                if (bytes_saved + bytes_to_read > file_size)
                    bytes_to_read = file_size - bytes_saved;

                char store_chunk[bytes_to_read];  // Temporary buffer to hold the incoming data
                ssize_t read_chunk = read(sockfd, store_chunk, bytes_to_read);
                if (read_chunk <= 0)
                {
                    perror("Error reading data chunk");
                    free(dynamicBuffer);
                    return -1;
                }

                // Update buffer size if needed
                if (bytes_saved + read_chunk > buffer_size)
                {
                    // Move data to a temporary buffer before realloc
                    char temp_buffer[bytes_saved];
                    memmove(temp_buffer, dynamicBuffer, bytes_saved);

                    char* temp_realloc = realloc(dynamicBuffer, bytes_saved + read_chunk);
                    if (temp_realloc == NULL)
                    {
                        perror("Error dynamically increasing buffer");
                        free(dynamicBuffer);
                        return -1;
                    }
                    dynamicBuffer = temp_realloc;
                    buffer_size = bytes_saved + read_chunk;

                    // Move data back to the reallocated buffer
                    memmove(dynamicBuffer, temp_buffer, bytes_saved);
                }

                // Copy the read data from store_chunk into dynamicBuffer at the correct offset
                memmove(dynamicBuffer + bytes_saved, store_chunk, read_chunk);
                bytes_saved += read_chunk;
            }

            // Writing to audio output
            if ( audio_out_fd!= -1 &&FD_ISSET(audio_out_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(audio_out_fd, dynamicBuffer + bytes_written, bytes_saved - bytes_written);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to client");
                    free(dynamicBuffer);
                    return -1;
                }
                bytes_written += (int)write_chunk;
            }

            // Writing to file
            if (file_dest_fd!= -1 && FD_ISSET(file_dest_fd, &cwrite_fds))
            {
                ssize_t write_chunk = write(file_dest_fd, dynamicBuffer + file_bytes, bytes_saved - file_bytes);
                if (write_chunk < 0)
                {
                    perror("Error sending data chunk to file");
                    free(dynamicBuffer);
                    return -1;
                }
                file_bytes += (int)write_chunk;
            }
        }

    }
    if(file_dest_fd == -1 && audio_out_fd == -1)
    {
        perror("no open file descriptors\n");
        free(dynamicBuffer);
        return -1;
    }
    printf("BYTES READ: %d\n,",bytes_saved);
    printf("BYTES SAVED TO FILE: %d\n,",file_bytes);
    printf("BYTES WRITTEN : %d\n",bytes_written);
    printf("FILE SIZE: %d\n", file_size);
    printf("dynamic buffer size:%d\n", buffer_size);
    if (audio_out_fd != -1) close(audio_out_fd);
    if (file_dest_fd != -1) close(file_dest_fd);
    free(dynamicBuffer);
    return 0;
}

static void _print_shell_help(){
    printf("Commands:\n");
    printf("  list: List the files in the library\n");
    printf("  get <file_index>: Get a file from the library\n");
    printf("  stream <file_index>: Stream a file from the library (without saving it)\n");
    printf("  stream+ <file_index>: Stream a file from the library\n");
    printf("                        and save it to the local library\n");
    printf("  help: Display this help message\n");
    printf("  quit: Quit the client\n");
}


/*
** Shell to handle the client options
** ----------------------------------
** This function is a mini shell to handle the client options. It prompts the
** user for a command and then calls the appropriate function to handle the
** command. The user can enter the following commands:
** - "list" to list the files in the library
** - "get <file_index>" to get a file from the library
** - "stream <file_index>" to stream a file from the library (without saving it)
** - "stream+ <file_index>" to stream a file from the library and save it to the local library
** - "help" to display the help message
** - "quit" to quit the client
*/
static int client_shell(int sockfd, const char *library_directory) {
    char buffer[REQUEST_BUFFER_SIZE];
    char *command;
    int file_index;

    Library library = {"client", library_directory, NULL, 0};

    while (1) {
        if (library.files == 0) {
            printf("Server library is empty or not retrieved yet\n");
        }

        printf("Enter a command: ");
        if (fgets(buffer, REQUEST_BUFFER_SIZE, stdin) == NULL) {
            perror("client_shell");
            goto error;
        }

        command = strtok(buffer, " \n");
        if (command == NULL) {
            continue;
        }

        // List Request -- list the files in the library
        if (strcmp(command, CMD_LIST) == 0) {
            if (list_request(sockfd, &library) == -1) {
                goto error;
            }


            // Get Request -- get a file from the library
        } else if (strcmp(command, CMD_GET) == 0) {
            char *file_index_str = strtok(NULL, " \n");
            if (file_index_str == NULL) {
                printf("Usage: get <file_index>\n");
                continue;
            }
            file_index = strtol(file_index_str, NULL, 10);
            if (file_index < 0 || file_index >= library.num_files) {
                printf("Invalid file index\n");
                continue;
            }

            if (get_file_request(sockfd, file_index, &library) == -1) {
                goto error;
            }

            // Stream Request -- stream a file from the library (without saving it)
        } else if (strcmp(command, CMD_STREAM) == 0) {
            char *file_index_str = strtok(NULL, " \n");
            if (file_index_str == NULL) {
                printf("Usage: stream <file_index>\n");
                continue;
            }
            file_index = strtol(file_index_str, NULL, 10);
            if (file_index < 0 || file_index >= library.num_files) {
                printf("Invalid file index\n");
                continue;
            }

            if (stream_request(sockfd, file_index) == -1) {
                goto error;
            }

            // Stream and Get Request -- stream a file from the library and save it to the local library
        } else if (strcmp(command, CMD_STREAM_AND_GET) == 0) {
            char *file_index_str = strtok(NULL, " \n");
            if (file_index_str == NULL) {
                printf("Usage: stream+ <file_index>\n");
                continue;
            }
            file_index = strtol(file_index_str, NULL, 10);
            if (file_index < 0 || file_index >= library.num_files) {
                printf("Invalid file index\n");
                continue;
            }

            if (stream_and_get_request(sockfd, file_index, &library) == -1) {
                goto error;
            }

        } else if (strcmp(command, CMD_HELP) == 0) {
            _print_shell_help();

        } else if (strcmp(command, CMD_QUIT) == 0) {
            printf("Quitting shell\n");
            break;

        } else {
            printf("Invalid command\n");
        }
    }

    _free_library(&library);
    return 0;
    error:
    _free_library(&library);
    return -1;
}


static void print_usage() {
    printf("Usage: as_client [-h] [-a NETWORK_ADDRESS] [-p PORT] [-l LIBRARY_DIRECTORY]\n");
    printf("  -h: Print this help message\n");
    printf("  -a NETWORK_ADDRESS: Connect to server at NETWORK_ADDRESS (default 'localhost')\n");
    printf("  -p  Port to listen on (default: " XSTR(DEFAULT_PORT) ")\n");
    printf("  -l LIBRARY_DIRECTORY: Use LIBRARY_DIRECTORY as the library directory (default 'as-library')\n");
}


int main(int argc, char * const *argv) {
    int opt;
    int port = DEFAULT_PORT;
    const char *hostname = "localhost";
    const char *library_directory = "saved";

    while ((opt = getopt(argc, argv, "ha:p:l:")) != -1) {
        switch (opt) {
            case 'h':
                print_usage();
                return 0;
            case 'a':
                hostname = optarg;
                break;
            case 'p':
                port = strtol(optarg, NULL, 10);
                if (port < 0 || port > 65535) {
                    ERR_PRINT("Invalid port number %d\n", port);
                    return 1;
                }
                break;
            case 'l':
                library_directory = optarg;
                break;
            default:
                print_usage();
                return 1;
        }
    }

    printf("Connecting to server at %s:%d, using library in %s\n",
           hostname, port, library_directory);

    int sockfd = connect_to_server(port, hostname);
    if (sockfd == -1) {
        return -1;
    }

    int result = client_shell(sockfd, library_directory);
    if (result == -1) {
        close(sockfd);
        return -1;
    }

    close(sockfd);
    return 0;
}
