// Clone one template per component; content is inserted as text, not HTML.
(() => {
// 공통 목록 생성 함수 시작
  function renderList(containerId, templateId, items, fill) {
    const template = document.getElementById(templateId);
    const nodes = items.map((item, index) => {
      const node = template.content.firstElementChild.cloneNode(true);
      fill(node, item, index);
      return node;
    });
    document.getElementById(containerId).replaceChildren(...nodes);
  }
// 공통 목록 생성 함수 끝

// 기술 카드 생성 시작
  renderList('skill-list', 'skill-template', portfolio.skills, (card, skill) => {
    card.href = skill.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.classList.add(skill.theme);
    card.querySelector('.skill-dot').classList.add(`dot-${skill.dot}`);
    card.querySelector('p').textContent = skill.title;
  });
// 기술 카드 생성 끝

// 개발 도구 생성 시작
  renderList('tool-list', 'tool-template', portfolio.tools, (tag, name) => {
    tag.textContent = name;
  });
// 개발 도구 생성 끝

// 프로젝트 카드 생성 시작
  renderList('project-list', 'project-template', portfolio.projects, (card, project, index) => {
    const number = card.querySelector('.project-number');
    number.textContent = project.number;
    number.classList.add(project.theme);
    card.querySelector('.project-title').textContent = project.title;
    card.querySelector('.project-meta').textContent = project.meta;
    card.querySelector('.body-text').textContent = project.details;
    if (index) card.classList.add(`stagger-${index + 1}`);
  });
// 프로젝트 카드 생성 끝

// 학력·활동 카드 생성 시작
  renderList('profile-list', 'profile-template', portfolio.profiles, (card, profile, index) => {
    const title = card.querySelector('h3');
    title.textContent = profile.title;
    title.classList.add(profile.theme);
    const items = profile.items.map(text => {
      const item = document.createElement('li');
      item.className = 'body-text leading-relaxed break-keep';
      item.textContent = text;
      return item;
    });
    const list = card.querySelector('ul');
    list.className = index ? 'space-y-3' : 'space-y-4';
    list.replaceChildren(...items);
    if (index) card.classList.add(`stagger-${index + 1}`);
  });
// 학력·활동 카드 생성 끝
})();
