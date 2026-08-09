import PyPDF2
from docx import Document
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class ResumeParser:
    """Service for parsing resume files"""

    @staticmethod
    async def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(iter([file_content]))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            return ""

    @staticmethod
    async def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            from io import BytesIO
            doc = Document(BytesIO(file_content))
            text = ""
            for para in doc.paragraphs:
                text += para.text + "\n"
            return text
        except Exception as e:
            logger.error(f"Error parsing DOCX: {e}")
            return ""

    @staticmethod
    async def extract_text_from_txt(file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode('utf-8', errors='ignore')
        except Exception as e:
            logger.error(f"Error parsing TXT: {e}")
            return ""

    @staticmethod
    async def parse_resume(file_content: bytes, filename: str) -> Optional[str]:
        """Parse resume file and extract text"""
        filename_lower = filename.lower()

        if filename_lower.endswith('.pdf'):
            return await ResumeParser.extract_text_from_pdf(file_content)
        elif filename_lower.endswith('.docx'):
            return await ResumeParser.extract_text_from_docx(file_content)
        elif filename_lower.endswith('.txt'):
            return await ResumeParser.extract_text_from_txt(file_content)
        else:
            logger.warning(f"Unsupported file format: {filename}")
            return None

resume_parser = ResumeParser()
