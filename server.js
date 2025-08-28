// server.js

const express = require('express');
const path = require('path');
const fs = require('fs'); // 1. استدعاء أداة التعامل مع الملفات (fs)
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// --- قاعدة البيانات ---
const DB_FILE = path.join(__dirname, 'db.json');

// --- الرادار الجديد: إرسال كل المواضيع المحفوظة إلى الموقع ---
app.get('/api/topics', (req, res) => {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'خطأ في قراءة قاعدة البيانات' });
    }
    res.json(JSON.parse(data).topics);
  });
});

// --- رادار إضافة موضوع (النسخة المطورة) ---
app.post('/api/topics', (req, res) => {
  const newTopic = {
    id: Date.now(), // لإعطاء كل موضوع رقمًا مميزًا
    title: req.body.title,
    content: req.body.content,
    author: 'مستخدم', // يمكنك تطويرها لاحقًا
    date: new Date().toISOString()
  };

  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'خطأ في قراءة قاعدة البيانات' });
    }
    const db = JSON.parse(data);
    db.topics.unshift(newTopic); // إضافة الموضوع الجديد في بداية القائمة

    fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'خطأ في حفظ الموضوع' });
      }
      res.status(201).json(newTopic);
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`المحرك يعمل الآن! العنوان: http://localhost:${PORT}`);
});