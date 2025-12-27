import type { Period } from '../types';

export class VisionOCRService {
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly MODEL =
    process.env.NEXT_PUBLIC_OCR_MODEL || 'qwen/qwen2.5-vl-72b-instruct:free';
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

  async extractPeriods(imageFile: File): Promise<Period[]> {
    if (!this.API_KEY) {
      throw new Error('OpenRouter API key not configured');
    }

    const base64 = await this.fileToBase64(imageFile);

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: this.getPrompt() },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64}` },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OCR failed: ${response.statusText}`);
    }

    const data = await response.json();
    const extracted = JSON.parse(data.choices[0].message.content);

    return extracted.periods.map((p: any) => ({
      id: crypto.randomUUID(),
      start_date: p.start_date,
      end_date: p.end_date,
      monthly_salary: p.monthly_salary,
    }));
  }

  private getPrompt(): string {
    return `Trích xuất các giai đoạn đóng BHXH từ hình ảnh này.

Trả về JSON với format:
{
  "periods": [
    {
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "monthly_salary": <số tiền>
    }
  ]
}

Quy tắc:
- Chuyển đổi định dạng ngày Việt Nam sang ISO (YYYY-MM-DD)
- Loại bỏ ký hiệu tiền tệ khỏi mức lương
- Trích xuất TẤT CẢ các giai đoạn hiển thị
- Đảm bảo số tiền là số nguyên (không có dấu phẩy hoặc chấm)`;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result?.toString().split(',')[1] || '';
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export const visionOCRService = new VisionOCRService();
