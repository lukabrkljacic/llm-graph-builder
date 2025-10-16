from langchain_text_splitters import TokenTextSplitter
from langchain.docstore.document import Document
from langchain_neo4j import Neo4jGraph
import logging
from src.document_sources.youtube import get_chunks_with_timestamps, get_calculated_timestamps
import re
import os

logging.basicConfig(format="%(asctime)s - %(message)s", level="INFO")


class CreateChunksofDocument:
    def __init__(self, pages: list[Document], graph: Neo4jGraph):
        self.pages = pages
        self.graph = graph

    def split_file_into_chunks(self,token_chunk_size, chunk_overlap):
        """
        Split a list of documents(file pages) into chunks of fixed size.

        Args:
            pages: A list of pages to split. Each page is a list of text strings.

        Returns:
            A list of chunks each of which is a langchain Document.
        """
        logging.info("Split file into smaller chunks")
        try:
            token_chunk_size = int(token_chunk_size)
        except (TypeError, ValueError):
            raise ValueError("token_chunk_size must be a positive integer") from None

        if token_chunk_size <= 0:
            raise ValueError("token_chunk_size must be a positive integer")

        try:
            chunk_overlap = int(chunk_overlap)
        except (TypeError, ValueError):
            logging.warning(
                "chunk_overlap value %r is invalid. Defaulting to 0.", chunk_overlap
            )
            chunk_overlap = 0

        if chunk_overlap < 0:
            logging.warning("chunk_overlap cannot be negative. Defaulting to 0.")
            chunk_overlap = 0
        elif chunk_overlap >= token_chunk_size:
            adjusted_overlap = max(token_chunk_size - 1, 0)
            logging.warning(
                "chunk_overlap %d must be smaller than token_chunk_size %d. Using %d.",
                chunk_overlap,
                token_chunk_size,
                adjusted_overlap,
            )
            chunk_overlap = adjusted_overlap

        try:
            max_token_chunk_size = int(os.getenv('MAX_TOKEN_CHUNK_SIZE', 10000))
        except (TypeError, ValueError):
            logging.warning(
                "MAX_TOKEN_CHUNK_SIZE environment variable is invalid. Using 10000."
            )
            max_token_chunk_size = 10000

        text_splitter = TokenTextSplitter(
            chunk_size=token_chunk_size, chunk_overlap=chunk_overlap
        )
        chunk_to_be_created = max(max_token_chunk_size // token_chunk_size, 1)

        if 'page' in self.pages[0].metadata:
            chunks = []
            for i, document in enumerate(self.pages):
                page_number = i + 1
                if len(chunks) >= chunk_to_be_created:
                    break
                else:
                    for chunk in text_splitter.split_documents([document]):
                        chunks.append(Document(page_content=chunk.page_content, metadata={'page_number':page_number}))    
        
        elif 'length' in self.pages[0].metadata:
            if len(self.pages) == 1  or (len(self.pages) > 1 and self.pages[1].page_content.strip() == ''): 
                match = re.search(r'(?:v=)([0-9A-Za-z_-]{11})\s*',self.pages[0].metadata['source'])
                youtube_id=match.group(1)   
                chunks_without_time_range = text_splitter.split_documents([self.pages[0]])
                chunks = get_calculated_timestamps(chunks_without_time_range[:chunk_to_be_created], youtube_id)
            else: 
                chunks_without_time_range = text_splitter.split_documents(self.pages)
                chunks = get_chunks_with_timestamps(chunks_without_time_range[:chunk_to_be_created])
        else:
            chunks = text_splitter.split_documents(self.pages)
            
        chunks = chunks[:chunk_to_be_created]
        return chunks