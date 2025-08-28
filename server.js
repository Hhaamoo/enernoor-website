// server.js - الإصدار النهائي

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000; // Render يستخدم هذا السطر

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

const DB_FILE = path.join(__dirname, 'db.json');

// --- إرسال كل المواضيع المحفوظة ---
app.get('/api/topics', (req, res) => {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading DB' });
    res.json(JSON.parse(data).topics);
  });
});

// --- إضافة موضوع جديد ---
app.post('/api/topics', (req, res) => {
  const newTopic = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    author: 'مستخدم',
    date: new Date().toISOString()
  };
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading DB' });
    const db = JSON.parse(data);
    db.topics.unshift(newTopic);
    fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error saving topic' });
      res.status(201).json(newTopic);
    });
  });
});

// --- القاعدة الرئيسية التي تعرض الصفحة الأولى ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === القاعدة الجديدة والمهمة التي تصلح كل شيء ===
// هذه القاعدة تقول: "إذا طلب أي شخص صفحة داخل مجلد pages"
// "اذهب وأعطه الملف الصحيح من هناك"
app.get('/pages/:pageName', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', req.params.pageName));
});
// === نهاية القاعدة الجديدة ===


app.listen(PORT, () => {
  console.log(`المحرك يعمل الآن على البوابة ${PORT}`);
});