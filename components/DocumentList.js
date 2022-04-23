import { createElement, createLiElement, createCheckboxElement, getDocumentListTag } from '../utils/createElement.js';
import { DOCUMENTLIST_NEW_ERROR } from '../utils/error.js';

export default function({ $target,
  initialState,
  clickDocument,
  addDocument,
  deleteDocument }) {
  try {
    if (!new.target) throw new Error(DOCUMENTLIST_NEW_ERROR);

    const init = () => {
      this.checkState = (liId) => {
        const $checkedLi = $target.querySelectorAll('.strong');
        for (const $li of $checkedLi) $li.classList.remove('strong');
  
        if (liId) {
          const $document = document.getElementById(liId);
          $document.classList.add('strong');        
        }
      }

      this.addState = (childState, parentStateId = null) => {
        if (parentStateId) {
          addDocumentTag(childState, parentStateId);
        }
        else {
          addRootDocumentTag(childState);
        }
      }
  
      this.deleteState = (liId) => {
        const $li = document.getElementById(liId);
        const $siblingDiv = $li.previousElementSibling;
        if ($siblingDiv !== null && $siblingDiv.matches('div')) {
          // 하위 문서 있는 경우, div와 ul의 자식 모두 꺼내고 삭제
          const $div = $li.previousElementSibling;
          const $ul = $li.nextElementSibling;
          const $parentUl = $li.parentElement;
          const $rootUl = $target.querySelector('.root-ul');
          const tags = [...$ul.children];
          const $fragment = document.createDocumentFragment();
          for (const $ of tags) $fragment.appendChild($);
          $rootUl.appendChild($fragment);
          
          $parentUl.removeChild($div);
          $parentUl.removeChild($li);
          $parentUl.removeChild($ul);
  
          // 형제 문서가 없는 경우, 상위 문서의 checkbox 제거
          if ($parentUl.childElementCount === 0 && $parentUl.className !== 'root-ul') {
            const $parentDiv = $parentUl.previousElementSibling.previousElementSibling;
            $parentUl.parentElement.removeChild($parentUl);
            $parentDiv.parentElement.removeChild($parentDiv);
          }
        } else {
          // 하위 문서 없는 경우
          const $ul = $li.parentElement;
          if ($ul.childElementCount > 1 || $ul.className.includes('root-ul')) {
            // 형제 문서가 있는 경우, 해당 문서만 삭제
            $li.parentElement.removeChild($li);
          } else {
            // 형제 문서가 없는 경우, 상위 문서의 checkbox 제거
            const $div = $ul.previousElementSibling.previousElementSibling;
            $ul.parentElement.removeChild($div);
            $ul.parentElement.removeChild($ul);
          }
        }
      }
  
      this.saveState = (liId, liTitle) => {
        const $a = document.getElementById(liId).children[0];
        $a.textContent = liTitle;
      }
    }

    const clickDocumentList = (event) => {
      const clickedTarget = event.target;
      if (clickedTarget.matches('.add-root-button')) {
        addDocument();
      } else if (clickedTarget.matches('li')) {
        const { href } = clickedTarget.firstElementChild;
        const path = href.replace(window.location.origin, '');
        const liId = clickedTarget.id;

        clickDocument(liId, path);
      } else if (clickedTarget.matches('a')) {
        event.preventDefault();

        const { href } = event.target;
        const path = href.replace(window.location.origin, '');
        const liId = clickedTarget.closest('li').id;

        clickDocument(liId, path);
      } else if (clickedTarget.matches('button')) {
        const $button = clickedTarget.closest('button');
        const operatorName = $button.id.substring(0, 3);
        const liId = $button.id.substring(4);

        if (operatorName === 'add') {
          addDocument(liId);
        }
        else if (operatorName === 'del') {
          deleteDocument(liId);
        }
      } else if (clickedTarget.matches('input')) {
        const $inputElement = clickedTarget.parentElement.nextElementSibling.nextElementSibling;

        if ($inputElement !== null && $inputElement.matches('ul')) $inputElement.classList.toggle('hidden');
      }
    }

    const addRootDocumentTag = ({ id, title }) => {
      const $rootUl = $target.querySelector('.root-ul');
      const $li = createLiElement(id, title);

      $rootUl.appendChild($li);
    }

    const addDocumentTag = ({ id, title }, parentLiId) => {
      const $childUl = document.getElementById(parentLiId).nextElementSibling;
      if ($childUl !== null && $childUl.matches('ul')) { // 하위 문서(추가할 문서와 형제 노드)가 있는 경우
        const $checkInput = document.getElementById(parentLiId).previousElementSibling.firstElementChild;
        const $li = createLiElement(id, title);
        
        $childUl.classList.remove('hidden');
        $checkInput.checked = true;
        $childUl.appendChild($li);
      } else {  // 하위 문서가 없는 경우
        const $parentLi = document.getElementById(parentLiId);
        const $parentUl = $parentLi.parentElement;
        const $LiNext = $parentLi.nextElementSibling;
        const $div = createCheckboxElement({ id, checked : true });
        const $ul = createElement({ tag: 'ul' });
        const $li = createLiElement(id, title);
        
        $parentUl.insertBefore($div, $parentLi);
        $ul.appendChild($li);

        if ($LiNext) {
          $parentUl.insertBefore($ul, $LiNext);
        }
        else {
          $parentUl.appendChild($ul);
        }
      }
    }

    // DOM
    const $fragment = document.createDocumentFragment();
    const $addRootDocumentButton = createElement({
      tag : 'button',
      attributes: {
        class: 'add-root-button'
      }
    });
    const $ul = getDocumentListTag(initialState, false);

    $addRootDocumentButton.textContent = '새문서';

    $addRootDocumentButton.addEventListener('click', clickDocumentList);
    $ul.addEventListener('click', clickDocumentList);
    
    $fragment.appendChild($addRootDocumentButton);
    $fragment.appendChild($ul);
    $target.appendChild($fragment);
    
    init();
  } catch (error) {
    console.log(error);
  }
}