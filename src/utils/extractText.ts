import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'

export async function extractTextFromPDF(buffer: Buffer): Promise<Document[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
  const pdfParse: any = require('pdf-parse/lib/pdf-parse')
  const result = await pdfParse(buffer)
  return [new Document({ pageContent: result.text })]
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'gemini-embedding-001',
    apiKey: process.env.GOOGLE_API_KEY,
  })
  return embeddings.embedQuery(text)
}

export async function splitIntoChunks(text: string): Promise<string[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const docs = await splitter.createDocuments([text])
  return docs.map(doc => doc.pageContent)
}
