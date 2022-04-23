export const createElement = ({ tag, attributes }) => {
  const $ = document.createElement(tag);
  if(attributes) {
    Object.keys(attributes).forEach(key => {
      const value = attributes[key];
      $.setAttribute(key, attributes[key]);
    })
  }
  return $;
}

// DocumentList의 문서 1개
export const createLiElement = (id, title) => {
  const $li = createElement({
    tag: 'li',
    attributes: { id }
  });
  const $div = createElement({
    tag: 'div',
    attributes: {
      class: 'add-del-div'
    }
  });
  const $a = createElement({
    tag: 'a',
    attributes: {
      class: 'li-a',
      href: `/documents/${id}`
    }
  });
  const $addChildDocumentButton = createElement({
    tag : 'button',
    attributes: {
      id: `add-${id}`,
      class: 'add-button'
    }
  });
  const $deleteDocumentButton = createElement({
    tag: 'button',
    attributes: {
      id: `del-${id}`,
      class: 'del-button'
    }
  });
  $a.textContent = title;
  $deleteDocumentButton.textContent = 'X';
  $addChildDocumentButton.textContent = '+';
  $div.appendChild($addChildDocumentButton);
  $div.appendChild($deleteDocumentButton);
  $li.appendChild($a);
  $li.appendChild($div);
  return $li;
}

// DocumentList의 하위문서 토글checkbox
export const createCheckboxElement = ({ id, checked }) => {
  const $div = createElement({
    tag: 'div',
    attributes: {
      class: 'absolute'
    }
  });
  const $checkInput = createElement({
    tag: 'input',
    attributes: {
      type: 'checkbox',
      id: `cb-${id}`,
      class: 'check-input'
    }
  });
  const $label = createElement({
    tag: 'label',
    attributes: {
      class: 'check-label',
      for: `cb-${id}`
    }
  });
  if(checked) $checkInput.checked = true;
  $div.appendChild($checkInput);
  $div.appendChild($label);
  return $div;
}

// DocumentList 재귀로 만들기
export const getDocumentListTag = (list, isChild) => {
  const $ul = createElement({
    tag: 'ul',
    attributes: {
      class: (isChild ? 'hidden' : 'root-ul')
    }
  });
  for (const { title, id, documents } of list) {
    const $li = createLiElement(id, title);

    if (documents.length > 0) {
      const $div = createCheckboxElement({ id, checked : false });
      $ul.appendChild($div);
    }
    $ul.appendChild($li);

    if (documents.length > 0) {
      const $childUl = getDocumentListTag(documents, true);
      $ul.appendChild($childUl);
    }
  }
  return $ul;
}