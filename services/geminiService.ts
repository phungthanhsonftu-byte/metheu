
import { GoogleGenAI, Type } from "@google/genai";
import { LSXData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeEmbroideryDesign(imageDataBase64: string, fabricType: string): Promise<LSXData> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    Bạn là Chuyên gia Quản lý Sản xuất tại xưởng thêu METHEU.
    Nhiệm vụ: Phân tích ảnh thiết kế thêu tay và xuất ra dữ liệu Lệnh sản xuất (LSX) bằng TIẾNG VIỆT hoàn toàn.
    
    TÍNH NĂNG TỰ NHẬN DIỆN SẢN PHẨM:
    Xác định chính xác loại sản phẩm: Sổ tay, Mũ, Vương miện, Tạp dề, Váy, Khăn tay, Túi...
    
    YÊU CẦU CHI TIẾT VỀ MÀU CHỈ:
    - Mỗi họa tiết thêu phải có mã màu DMC tương ứng.
    - Phải cung cấp: Mã số DMC (dmcCode), Tên màu tiếng Việt (colorName) và Mã màu Hex (colorHex) để hiển thị trực quan.
    - Ví dụ: dmcCode: "321", colorName: "Đỏ tươi", colorHex: "#C50022".
    - Nhận diện các tông màu kim loại (Vàng, Bạc) nếu có và ghi chú sử dụng chỉ kim tuyến.

    ĐỊNH MỨC THỜI GIAN THEO DÒNG SẢN PHẨM:
    - Vương miện/Mũ/Khăn tay: 120 - 180 phút.
    - Sổ tay/Tạp dề: 150 - 210 phút.
    - Váy/Áo dài: 240 - 480 phút.
    
    GHI CHÚ QC:
    - Tập trung vào độ mịn đường thêu, sự chính xác của màu sắc so với thiết kế gốc.
    
    ĐỊNH DẠNG ĐẦU RA: JSON tiếng Việt.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { text: `Nhận diện sản phẩm và bóc tách màu chỉ thêu chi tiết cho mẫu thêu trên vải ${fabricType}.` },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataBase64.split(',')[1] || imageDataBase64
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orderCode: { type: Type.STRING },
          productType: { type: Type.STRING },
          fabric: { type: Type.STRING },
          theme: { type: Type.STRING },
          details: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stt: { type: Type.INTEGER },
                motif: { type: Type.STRING },
                technique: { type: Type.STRING },
                dmcCode: { type: Type.STRING },
                colorName: { type: Type.STRING },
                colorHex: { type: Type.STRING },
                timeMinutes: { type: Type.NUMBER },
                technicalRequirement: { type: Type.STRING }
              },
              required: ["stt", "motif", "technique", "dmcCode", "colorName", "colorHex", "timeMinutes", "technicalRequirement"]
            }
          },
          totalTime: { type: Type.NUMBER },
          palette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                name: { type: Type.STRING },
                hex: { type: Type.STRING }
              },
              required: ["code", "name", "hex"]
            }
          },
          qcNote: { type: Type.STRING }
        },
        required: ["orderCode", "productType", "fabric", "theme", "details", "totalTime", "palette", "qcNote"]
      }
    }
  });

  return JSON.parse(response.text);
}
