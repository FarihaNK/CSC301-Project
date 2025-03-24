from whoosh.fields import Schema, TEXT, ID
from whoosh.index import create_in
import os

DOCS = [
    {"content": "Red shoes are stylish and comfortable.", "source": "doc1.txt"},
    {"content": "Blue shoes are waterproof and rugged.", "source": "doc2.txt"},
    # Add more sample docs or load from real files
]

def build_whoosh_index(index_dir="./whoosh_index"):
    if not os.path.exists(index_dir):
        os.mkdir(index_dir)

    schema = Schema(content=TEXT(stored=True), source=ID(stored=True))
    ix = create_in(index_dir, schema)
    writer = ix.writer()

    for doc in DOCS:
        writer.add_document(content=doc["content"], source=doc["source"])

    writer.commit()
   # print(f"Whoosh index built in '{index_dir}'")

if __name__ == "__main__":
    build_whoosh_index()
