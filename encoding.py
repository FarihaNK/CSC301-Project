import os

import chardet
def detect_encoding(file_path):
    """Detect the encoding of a file."""
    try:
        with open(file_path, 'rb') as file:
            raw_data = file.read(10000)  # Read the first 10k bytes
        result = chardet.detect(raw_data)
        return result['encoding']
    except PermissionError as e:
        print(f"Permission error accessing file {file_path}: {e}")
        return None

# Example usage
if __name__ == "__main__":
    DATA_PATH = "sampledata"
    encoding = detect_encoding(DATA_PATH)
    if encoding:
        print(f"Detected encoding: {encoding}")
    else:
        print("Failed to detect encoding due to permission error.")
