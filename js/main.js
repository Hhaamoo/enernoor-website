// js/main.js

document.addEventListener('DOMContentLoaded', () => {

  // --- منطقة عرض المواضيع ---
  const topicListContainer = document.querySelector('.topic-list');

  // --- وظيفة لجلب وعرض كل المواضيع ---
  async function fetchAndDisplayTopics() {
    try {
      const response = await fetch('/api/topics');
      const topics = await response.json();

      topicListContainer.innerHTML = ''; // تفريغ القائمة القديمة

      if (topics.length === 0) {
        topicListContainer.innerHTML = '<p style="padding: 20px;">لا توجد مواضيع حاليًا. كن أول من يضيف موضوعًا!</p>';
      } else {
        topics.forEach(topic => {
          const topicElement = document.createElement('article');
          topicElement.className = 'topic-item';
          topicElement.innerHTML = `
            <div class="topic-main">
              <h3 class="topic-title"><a href="#">${topic.title}</a></h3>
              <div class="topic-meta">
                <span>بواسطة: ${topic.author}</span> | <span>${new Date(topic.date).toLocaleString()}</span>
              </div>
            </div>
            <div class="topic-stats">
              <span>الردود: <strong>0</strong></span>
              <span>المشاهدات: <strong>0</strong></span>
            </div>
          `;
          topicListContainer.appendChild(topicElement);
        });
      }
    } catch (error) {
      console.error('فشل في جلب المواضيع:', error);
    }
  }

  // --- منطقة النافذة المنبثقة (Modal) ---
  const newTopicBtn = document.querySelector('.new-topic-btn');
  const modal = document.getElementById('newTopicModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const submitTopicBtn = document.querySelector('.modal-btn.submit');
  
  if (modal) {
    const closeModal = () => modal.classList.remove('active');
    newTopicBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('active'); });
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    submitTopicBtn.addEventListener('click', async () => {
      const title = document.getElementById('topicTitle').value;
      const content = document.getElementById('topicContent').value;
      if (!title || !content) return alert('الرجاء ملء كل الحقول.');
      
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        closeModal();
        document.getElementById('topicTitle').value = '';
        document.getElementById('topicContent').value = '';
        fetchAndDisplayTopics(); // إعادة تحميل المواضيع لتظهر الإضافة الجديدة فورًا!
      } else {
        alert('حدث خطأ أثناء إضافة الموضوع.');
      }
    });
  }
  
  // --- تشغيل كل شيء ---
  // تأكد من أننا في صفحة المنتدى قبل جلب المواضيع
  if (topicListContainer) {
    fetchAndDisplayTopics();
  }
});