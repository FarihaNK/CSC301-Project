/*
 * This code is provided solely for the personal and private use of students
 * taking the CSC369H course at the University of Toronto. Copying for purposes
 * other than this use is expressly prohibited. All forms of distribution of
 * this code, including but not limited to public repositories on GitHub,
 * GitLab, Bitbucket, or any other online platform, whether as given or with
 * any changes, are expressly prohibited.
 *
 * Authors: Andrew Peterson, Karen Reid, Alexey Khrabrov, Angela Brown, Kuei Sun
 *
 * All of the files in this directory and all subdirectories are:
 * Copyright (c) 2019, 2021 Karen Reid
 * Copyright (c) 2023, Angela Brown, Kuei Sun
 */

#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "malloc369.h"
#include "sim.h"
#include "coremap.h"
#include "swap.h"
#include "pagetable.h"

// Counters for various events.
// Your code must increment these when the related events occur.
size_t hit_count = 0;
size_t miss_count = 0;
size_t ref_count = 0;
size_t evict_clean_count = 0;
size_t evict_dirty_count = 0;

// Accessor functions for page table entries, to allow replacement
// algorithms to obtain information from a PTE, without depending
// on the internal implementation of the structure.

/* Returns true if the pte is marked valid, otherwise false */
bool is_valid(pt_entry_t *pte)
{
	if (pte->valid_entry==1)
	{
		return true;
	}
	return false;
}

/* Returns true if the pte is marked dirty, otherwise false */
bool is_dirty(pt_entry_t *pte)
{
	if(pte->modified_bit==1)
	{
		evict_dirty_count++;
		return true;
	}
	evict_clean_count++;
	return false;
}

/* Returns true if the pte is marked referenced, otherwise false */
bool get_referenced(pt_entry_t *pte)
{
	if (pte->referenced_bit==1)
	{
		ref_count++;
		return true;
	} 
	return false;
}

/* Sets the 'referenced' status of the pte to the given val */
void set_referenced(pt_entry_t *pte, bool val)
{
	ref_count++;//not sure abt this 
	if (val)
	{
	pte->referenced_bit=1;
	}
	else
	{
	pte->referenced_bit=0;
	}
}

/*
 * Initializes your page table.
 * This function is called once at the start of the simulation.
 * For the simulation, there is a single "process" whose reference trace is
 * being simulated, so there is just one overall page table.
 *
 * In a real OS, each process would have its own page table, which would
 * need to be allocated and initialized as part of process creation.
 * 
 * The format of the page table, and thus what you need to do to get ready
 * to start translating virtual addresses, is up to you. 
 */
void init_pagetable(void)
{
	pg_table = malloc369(NUM_ENTRIES*sizeof(void *****));
	//printf("Pg_table %x\n",pg_table);

	for(int i=0; i<NUM_ENTRIES; i++)
	{
		pg_table[i]=NULL; 
		// all entries in page table to null 
		//Outermost pg table 
	}
}

/*
 * Write virtual page represented by pte to swap, if needed, and update 
 * page table entry.
 *
 * Called from allocate_frame() in coremap.c after a victim page frame has
 * been selected. 
 *
 * Counters for evictions should be updated appropriately in this function.
 */
void handle_evict(pt_entry_t * pte)
{
	if (pte->modified_bit==1)
	{
		off_t off_val = swap_pageout(pte->frame_num,pte->swap_off);
		if (off_val != INVALID_SWAP)
		{
			printf("EVICT STATUS: Dirty evict being handeld\n");
			evict_dirty_count++;
			pte->modified_bit=0;
			pte->swap_off = off_val;
		}
	
	}
	printf("EVICT STATUS: Clean evict being handeld\n");
	evict_clean_count++;
	//(void)pte;
}

/*
 * Locate the physical frame number for the given vaddr using the page table.
 *
 * If the page table entry is invalid and not on swap, then this is the first 
 * reference to the page and a (simulated) physical frame should be allocated 
 * and initialized to all zeros (using init_frame from coremap.c).
 * If the page table entry is invalid and on swap, then a (simulated) physical 
 * frame should be allocated and filled by reading the page data from swap.
 *
 * Make sure to update page table entry status information:
 *  - the page table entry should be marked valid
 *  - if the type of access is a write ('S'tore or 'M'odify),
 *    the page table entry should be marked dirty
 *  - a page should be marked dirty on the first reference to the page,
 *    even if the type of access is a read ('L'oad or 'I'nstruction type).
 *  - DO NOT UPDATE the page table entry 'referenced' information. That
 *    should be done by the replacement algorithm functions.
 *
 * When you have a valid page table entry, return the page frame number
 * that holds the requested virtual page.
 *
 * Counters for hit, miss and reference events should be incremented in
 * this function.
 */
int find_frame_number(vaddr_t vaddr, char type)
{
	// To keep compiler happy - remove when you have a real use
	// (void)vaddr;
	// (void)type;
	//4 Level paging 
	
	uint64_t outer_index = (vaddr >> 39) & 0x1FF;  // Top 9 bits
	uint64_t level1_index = (vaddr >> 30) & 0x1FF; // Next 9 bits
	uint64_t level2_index = (vaddr >> 21) & 0x1FF; // Next 9 bits
	uint64_t level3_index = (vaddr >> 12) & 0x1FF; // Final 9 bits

	//case 1: outer most table is empty.
	if (pg_table[outer_index]==NULL)
	{
		pg_table[outer_index]= malloc369(NUM_ENTRIES*sizeof(void *));

		for (int i=0; i< NUM_ENTRIES; i++) //initialize to NULL ; safekeeping 
		{
			pg_table[outer_index][i]=NULL;
		}
	}
	//case 2: Level 1 Table is empty. 
	if (pg_table[outer_index][level1_index]==NULL)
	{
		pg_table[outer_index][level1_index] = malloc369(512*sizeof(void *));

		for (int i=0; i< NUM_ENTRIES; i++)
		{
			pg_table[outer_index][level1_index][i]=NULL;
		}
	}

	//case 3: Level 2 Table is empty 
	if (pg_table[outer_index][level1_index][level2_index]==NULL)
	{
		pg_table[outer_index][level1_index][level2_index] = malloc369(512*sizeof(void *));

		for (int i=0; i< NUM_ENTRIES; i++)
		{
			pg_table[outer_index][level1_index][level2_index][i]=NULL;
		}
	}
	//case 4: Level 3 Table is empty
	if (pg_table[outer_index][level1_index][level2_index][level3_index]==NULL)
	{
		pg_table[outer_index][level1_index][level2_index][level3_index] = malloc369(sizeof(struct pt_entry_s));
		struct pt_entry_s *ptr_pte = pg_table[outer_index][level1_index][level2_index][level3_index];

		ptr_pte->valid_entry = 0;       
        ptr_pte->modified_bit = 0;      
        ptr_pte->referenced_bit = 0;  
        ptr_pte->frame_num = -1;   
        ptr_pte->swap_off = -1;   
	}	



	//case5: its not empty 

	struct pt_entry_s *ptr_pte = pg_table[outer_index][level1_index][level2_index][level3_index];
	
	if (ptr_pte->valid_entry==1)
	{
		printf("found valid PTE in Pagetable\n");
		hit_count++;
		return ptr_pte->frame_num;
	}
	else // vlaid_entry ==0, page fault
	{
		printf("Pagefault occured, running else statement\n");
		miss_count++;
		int frame_num;
		if (ptr_pte->swap_off==-1) //first time called 
		{

			printf("First time allocating init pageframe\n");
			frame_num = allocate_frame(ptr_pte);
			init_frame(frame_num);
			ptr_pte->modified_bit=1;
			ptr_pte->frame_num = frame_num;
			ptr_pte->valid_entry = 1;
		}

		else
		{
			printf("Has been allocated before, swapping page in from page file\n");
			frame_num = allocate_frame(ptr_pte);
			swap_pagein(frame_num, ptr_pte->swap_off);
			ptr_pte->modified_bit=0;
			ptr_pte->frame_num = frame_num;
			ptr_pte->valid_entry = 1;
		}


		if (type =='S' || type =='M')
		{
			ptr_pte->modified_bit=1;
		}
		return frame_num;
	}
}


void print_pagetable(void)
{

}

// void free_pagetable(void)
// {
//     for (int i = 0; i < NUM_ENTRIES; i++) {
//         if (pg_table[i] != NULL) {
//             for (int j = 0; j < NUM_ENTRIES; j++) {
//                 if (pg_table[i][j] != NULL) {
//                     for (int k = 0; k < NUM_ENTRIES; k++) {
//                         if (pg_table[i][j][k] != NULL) {
//                             free369(pg_table[i][j][k]);
//                         }
//                     }
//                     free369(pg_table[i][j]);
//                 }
//             }
//             free369(pg_table[i]);
//         }
//     }
//     free369(pg_table);
// }


void free_pagetable(void)
{
    for (int i = 0; i < NUM_ENTRIES; i++) {
        if (pg_table[i] != NULL) {
            for (int j = 0; j < NUM_ENTRIES; j++) {
                if (pg_table[i][j] != NULL) {
                    for (int k = 0; k < NUM_ENTRIES; k++) {
                        if (pg_table[i][j][k] != NULL) {
                            free369(pg_table[i][j][k]);
                        }
                    }
                    free369(pg_table[i][j]);
                }
            }
            free369(pg_table[i]);
        }
    }
    free369(pg_table);
}
