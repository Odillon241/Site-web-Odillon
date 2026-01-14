import mammoth from "mammoth"

export async function convertDocxToHtml(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target?.result as ArrayBuffer
                const result = await mammoth.convertToHtml({ arrayBuffer })
                resolve(result.value)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = (error) => reject(error)
        reader.readAsArrayBuffer(file)
    })
}

export async function convertPdfToHtml(file: File): Promise<string> {
    const pdfjsLib = await import("pdfjs-dist")
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ""

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')

        // Simple heuristic: paragraphs often end with punctuation or are separated by space
        // We'll wrap pages in paragraphs for basic structure
        fullText += `<p>${pageText}</p>`
    }

    return fullText
}

export async function importDocument(file: File): Promise<string> {
    const type = file.type
    if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return convertDocxToHtml(file)
    } else if (type === "application/pdf") {
        return convertPdfToHtml(file)
    } else {
        throw new Error("Unsupported file type")
    }
}
