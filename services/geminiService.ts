import { GoogleGenerativeAI } from '@google/genai';
import { LSXData, MotifDetail, PaletteItem } from '../types';

// Lấy API key từ environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.error('⚠️ GEMINI_API_KEY chưa được cấu hình!');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeEmbroideryDesign(
  base64Image: string,
  fabric: string
): Promise<LSXData> {
  try {
    // Kiểm tra API key
    if (!API_KEY) {
      throw new Error('API Key chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào environment variables.');
    }

    // Loại bỏ prefix "data:image/..." nếu có
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Bạn là chuyên gia phân tích thiết kế thêu tay cao cấp của xưởng METHEU.

Phân tích hình ảnh thiết kế thêu này và trả về kết quả dạng JSON với cấu trúc sau:

{
  "orderCode": "LSX-YYYYMMDD-XXX",
  "productType": "Tên sản phẩm (ví dụ: Áo dài, Váy, Mũ, Túi xách, Khăn tay, v.v.)",
  "fabric": "${fabric}",
  "theme": "Chủ đề/phong cách thiết kế",
  "details": [
    {
      "stt": 1,
      "motif": "Tên họa tiết cụ thể",
      "technique": "Kỹ thuật thêu (Mũi xích, Mũi phẳng, Mũi thập, v.v.)",
      "dmcCode": "DMC XXX",
      "colorName": "Tên màu bằng tiếng Việt",
      "colorHex": "#XXXXXX",
      "timeMinutes": số phút ước tính,
      "technicalRequirement": "Yêu cầu kỹ thuật chi tiết"
    }
  ],
  "totalTime": tổng thời gian (phút),
  "palette": [
    {
      "code": "DMC XXX",
      "name": "Tên màu",
      "hex": "#XXXXXX"
    }
  ],
  "qcNote": "Ghi chú kiểm tra chất lượng"
}

QUAN TRỌNG:
- Phân tích kỹ từng chi tiết trong thiết kế
- Đề xuất kỹ thuật thêu phù hợp với từng họa tiết
- Ước tính thời gian thực tế dựa trên độ phức tạp
- Chọn mã màu DMC chính xác
- Đưa ra yêu cầu kỹ thuật cụ thể cho nghệ nhân
- Tạo mã LSX theo format: LSX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}

Chỉ trả về JSON thuần túy, KHÔNG có markdown, KHÔNG có giải thích thêm.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Response từ Gemini:', text);

    // Parse JSON từ response
    const cleanText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const data: LSXData = JSON.parse(cleanText);

    // Validate dữ liệu
    if (!data.details || data.details.length === 0) {
      throw new Error('Không phát hiện được chi tiết họa tiết trong thiết kế');
    }

    return data;

  } catch (error: any) {
    console.error('❌ Lỗi phân tích:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.message?.includes('API key')) {
      throw new Error('API Key không hợp lệ hoặc chưa được cấu hình');
    }
    
    if (error.message?.includes('quota')) {
      throw new Error('Đã vượt quá giới hạn API. Vui lòng thử lại sau.');
    }

    if (error instanceof SyntaxError) {
      throw new Error('Không thể phân tích dữ liệu trả về từ AI. Vui lòng thử lại.');
    }

    throw new Error(error.message || 'Không thể phân tích thiết kế. Vui lòng thử lại với ảnh rõ hơn.');
  }
}
