# قوالب البريد الإلكتروني - منصة رشد

هذا المجلد يحتوي على قوالب HTML للبريد الإلكتروني المستخدمة في منصة رشد.

## 📧 القوالب المتاحة

### 1. ActivateEmail.html
رسالة تفعيل الحساب التي تُرسل للمستخدمين الجدد بعد التسجيل.

**المتغيرات المطلوبة:**
- `{{ACTIVATION_LINK}}` - رابط تفعيل الحساب

**الاستخدام:**
```javascript
const emailHtml = activateEmailTemplate
  .replace(/{{ACTIVATION_LINK}}/g, activationUrl);
```

---

### 2. EvaluationResultEmail.html
رسالة نتيجة التقييم مع لوحة تحكم المؤشرات الرئيسية.

**المتغيرات المطلوبة:**
- `{{ORGANIZATION_NAME}}` - اسم المؤسسة
- `{{OVERALL_SCORE}}` - النتيجة الإجمالية (0-100)
- `{{SCORE_LABEL}}` - تصنيف النتيجة (ممتاز، جيد، متوسط، إلخ)
- `{{OPERATIONAL_SCORE}}` - نسبة الجاهزية التشغيلية (0-100)
- `{{FINANCIAL_SCORE}}` - نسبة الاستقرار المالي (0-100)
- `{{IMPACT_SCORE}}` - نسبة الأثر الاجتماعي (0-100)
- `{{GOVERNANCE_SCORE}}` - نسبة الحوكمة والامتثال (0-100)
- `{{INNOVATION_SCORE}}` - نسبة الابتكار والتطوير (0-100)
- `{{TRANSPARENCY_SCORE}}` - نسبة الشفافية (0-100)
- `{{STRENGTHS}}` - نقاط القوة
- `{{IMPROVEMENTS}}` - مجالات التحسين
- `{{RECOMMENDATION_1}}` - التوصية الأولى
- `{{RECOMMENDATION_2}}` - التوصية الثانية
- `{{RECOMMENDATION_3}}` - التوصية الثالثة
- `{{REPORT_LINK}}` - رابط التقرير الكامل
- `{{PLATFORM_LINK}}` - رابط المنصة
- `{{HELP_CENTER_LINK}}` - رابط مركز المساعدة
- `{{PRIVACY_LINK}}` - رابط سياسة الخصوصية

**الاستخدام:**
```javascript
const emailHtml = evaluationResultTemplate
  .replace(/{{ORGANIZATION_NAME}}/g, orgName)
  .replace(/{{OVERALL_SCORE}}/g, scores.overall)
  .replace(/{{SCORE_LABEL}}/g, getScoreLabel(scores.overall))
  .replace(/{{OPERATIONAL_SCORE}}/g, scores.operational)
  .replace(/{{FINANCIAL_SCORE}}/g, scores.financial)
  .replace(/{{IMPACT_SCORE}}/g, scores.impact)
  .replace(/{{GOVERNANCE_SCORE}}/g, scores.governance)
  .replace(/{{INNOVATION_SCORE}}/g, scores.innovation)
  .replace(/{{TRANSPARENCY_SCORE}}/g, scores.transparency)
  .replace(/{{STRENGTHS}}/g, analysis.strengths)
  .replace(/{{IMPROVEMENTS}}/g, analysis.improvements)
  .replace(/{{RECOMMENDATION_1}}/g, recommendations[0])
  .replace(/{{RECOMMENDATION_2}}/g, recommendations[1])
  .replace(/{{RECOMMENDATION_3}}/g, recommendations[2])
  .replace(/{{REPORT_LINK}}/g, reportUrl)
  .replace(/{{PLATFORM_LINK}}/g, 'https://rushdisiv.com/dashboard')
  .replace(/{{HELP_CENTER_LINK}}/g, 'https://rushdisiv.com/help')
  .replace(/{{PRIVACY_LINK}}/g, 'https://rushdisiv.com/privacy');
```

---

## 🎨 مواصفات التصميم

### الألوان الرئيسية
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success:** `#10b981`
- **Info:** `#3b82f6`
- **Warning:** `#f59e0b`
- **Background:** `#f5f7fa`

### الخطوط
- **Font Family:** 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Direction:** RTL (من اليمين لليسار)
- **Language:** Arabic

### البنية
- **Max Width:** 600px - 650px
- **Layout:** Table-based (متوافق مع جميع عملاء البريد الإلكتروني)
- **CSS:** Inline styles فقط (لضمان التوافق)

---

## 🔧 متطلبات التكامل

### على مستوى Backend (API)
يجب إنشاء Service للبريد الإلكتروني يقوم بـ:

1. قراءة ملفات HTML
2. استبدال المتغيرات بالقيم الفعلية
3. إرسال البريد عبر SMTP Provider (SendGrid, AWS SES, إلخ)

**مثال على Implementation بـ Node.js:**

```javascript
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      // SMTP configuration
    });
  }

  async sendActivationEmail(email, activationLink) {
    const template = fs.readFileSync(
      path.join(__dirname, '../emails/ActivateEmail.html'),
      'utf-8'
    );
    
    const html = template.replace(/{{ACTIVATION_LINK}}/g, activationLink);
    
    await this.transporter.sendMail({
      from: 'noreply@rushdisiv.com',
      to: email,
      subject: 'تفعيل حسابك - منصة رشد',
      html: html,
    });
  }

  async sendEvaluationResult(email, data) {
    const template = fs.readFileSync(
      path.join(__dirname, '../emails/EvaluationResultEmail.html'),
      'utf-8'
    );
    
    let html = template
      .replace(/{{ORGANIZATION_NAME}}/g, data.organizationName)
      .replace(/{{OVERALL_SCORE}}/g, data.scores.overall)
      .replace(/{{SCORE_LABEL}}/g, this.getScoreLabel(data.scores.overall))
      .replace(/{{OPERATIONAL_SCORE}}/g, data.scores.operational)
      .replace(/{{FINANCIAL_SCORE}}/g, data.scores.financial)
      .replace(/{{IMPACT_SCORE}}/g, data.scores.impact)
      .replace(/{{GOVERNANCE_SCORE}}/g, data.scores.governance)
      .replace(/{{INNOVATION_SCORE}}/g, data.scores.innovation)
      .replace(/{{TRANSPARENCY_SCORE}}/g, data.scores.transparency)
      .replace(/{{STRENGTHS}}/g, data.analysis.strengths)
      .replace(/{{IMPROVEMENTS}}/g, data.analysis.improvements)
      .replace(/{{RECOMMENDATION_1}}/g, data.recommendations[0])
      .replace(/{{RECOMMENDATION_2}}/g, data.recommendations[1])
      .replace(/{{RECOMMENDATION_3}}/g, data.recommendations[2])
      .replace(/{{REPORT_LINK}}/g, data.reportLink)
      .replace(/{{PLATFORM_LINK}}/g, 'https://rushdisiv.com/dashboard')
      .replace(/{{HELP_CENTER_LINK}}/g, 'https://rushdisiv.com/help')
      .replace(/{{PRIVACY_LINK}}/g, 'https://rushdisiv.com/privacy');
    
    await this.transporter.sendMail({
      from: 'noreply@rushdisiv.com',
      to: email,
      subject: 'نتيجة تقييم مؤسستك - منصة رشد',
      html: html,
    });
  }

  getScoreLabel(score) {
    if (score >= 90) return 'ممتاز';
    if (score >= 80) return 'جيد جداً';
    if (score >= 70) return 'جيد';
    if (score >= 60) return 'متوسط';
    return 'يحتاج تحسين';
  }
}

export default new EmailService();
```

---

## 🧪 اختبار القوالب

### عرض محلي
يمكنك فتح ملفات HTML مباشرة في المتصفح للمعاينة.

### أدوات الاختبار الموصى بها
- [Litmus](https://litmus.com) - اختبار التوافق مع عملاء البريد المختلفين
- [Email on Acid](https://www.emailonacid.com) - اختبار شامل
- [Mailtrap](https://mailtrap.io) - بيئة تطوير للبريد الإلكتروني

---

## 📝 ملاحظات مهمة

1. **استخدام Inline CSS فقط**: عملاء البريد الإلكتروني لا يدعمون CSS خارجي أو `<style>` tags بشكل موثوق
2. **Table-based Layout**: استخدام `<table>` للتخطيط ضروري للتوافق مع Outlook وعملاء البريد القديمة
3. **RTL Support**: جميع القوالب مصممة بـ `dir="rtl"` للغة العربية
4. **Logo URL**: يجب تحديث URL الشعار ليشير للموقع الفعلي بعد رفع الشعار
5. **Responsive Design**: القوالب متجاوبة وتعمل على الأجهزة المحمولة

---

## 🚀 التطوير المستقبلي

قوالب إضافية يمكن إضافتها:
- [ ] رسالة إعادة تعيين كلمة المرور
- [ ] رسالة تأكيد التبرع
- [ ] رسالة تحديث المشروع
- [ ] رسالة دعوة لحضور ورشة عمل
- [ ] نشرة إخبارية شهرية
- [ ] تنبيه انتهاء صلاحية التقرير

---

**آخر تحديث:** 18 يونيو 2026
