// js/main.js

// انتظر حتى يتم تحميل كل عناصر الصفحة
document.addEventListener('DOMContentLoaded', () => {

  // --- منطقة عرض المواضيع ---
  const topicListContainer = document.querySelector('.topic-list');

  // هذه وظيفة تجلب المواضيع من المحرك وتعرضها
  async function fetchAndDisplayTopics() {
    // تأكد من أننا في صفحة المنتدى قبل أن تحاول جلب المواضيع
    if (!topicListContainer) {
      return;
    }

    try {
      const response = await fetch('/api/topics');
      const topics = await response.json();

      topicListContainer.innerHTML = ''; // تفريغ القائمة القديمة أولاً

      if (topics.length === 0) {
        topicListContainer.innerHTML = '<div class="topic-item" style="justify-content: center;">لا توجد مواضيع حاليًا. كن أول من يضيف موضوعًا!</div>';
      } else {
        topics.forEach(topic => {
          const topicElement = document.createElement('article');
          topicElement.className = 'topic-item';
          topicElement.innerHTML = `
            <div class="topic-main">
              <h3 class="topic-title"><a href="#">${topic.title}</a></h3>
              <div class="topic-meta">
                <span>بواسطة: ${topic.author}</span> | <span>${new Date(topic.date).toLocaleDateString()}</span>
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

  // --- منطقة التحكم في نافذة "إضافة موضوع" ---
  const newTopicBtn = document.querySelector('.new-topic-btn');
  const modal = document.getElementById('newTopicModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');
  const submitTopicBtn = document.getElementById('submitTopicBtn'); // نستخدم الـ ID ليكون أدق
  
  // تأكد من وجود النافذة في الصفحة الحالية
  if (modal && newTopicBtn) {
    const closeModal = () => modal.classList.remove('active');
    const openModal = (e) => {
      e.preventDefault();
      modal.classList.add('active');
    };

    // ربط الأزرار بوظائفها
    newTopicBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelModalBtn.addEventListener('click', closeModal);

    // عند الضغط على زر "أضف الموضوع"
    submitTopicBtn.addEventListener('click', async () => {
      const titleInput = document.getElementById('topicTitle');
      const contentInput = document.getElementById('topicContent');
      
      const title = titleInput.value;
      const content = contentInput.value;
      
      if (!title || !content) {
        alert('الرجاء ملء كل الحقول.');
        return;
      }
      
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        closeModal();
        titleInput.value = ''; // تفريغ الحقول
        contentInput.value = ''; // تفريغ الحقول
        fetchAndDisplayTopics(); // إعادة تحميل المواضيع لتظهر الإضافة الجديدة فورًا!
      } else {
        alert('حدث خطأ أثناء إضافة الموضوع.');
      }
    });
  }
  
  // --- تشغيل كل شيء ---
  fetchAndDisplayTopics();
});