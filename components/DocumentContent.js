import { createElement } from '../utils/createElement.js';
import { debounce } from '../utils/debounce.js';
import { DOCUMENTCONTENT_NEW_ERROR } from '../utils/error.js';

export default function({ $target, initialState, saveDocument }) {
  try {
    if (!new.target) throw new Error(DOCUMENTCONTENT_NEW_ERROR);

    const init = () => {
      this.state = initialState;
    
      this.setstate = (newState) => {
        this.state = newState;
        clickEdit();
        this.render();
      }
  
      this.render = () => {
        $title.value = this.state.title;
        $content.innerHTML = this.state.content || '<div><br/></div>';
      }
    }

    const makePreview = () => {
      const tags = [...$content.children];
      const $fragment = document.createDocumentFragment();
      for(const $ of tags) {
        const text = $.textContent;
        const [head, ...rest] = text.split(' ');
        if (head.length < 7 && (head === '#' || head === '##' || head === '###')) {
          // h1, h2, .., h6 태그로 변환
          const $head = createElement({ tag: `h${head.length}` });
          $head.textContent = rest.join(' ');
          $fragment.appendChild($head);
        } else if (head === '-') {
          // li 태그로 변환
          const $head = createElement({tag: 'li' });
          $head.textContent = rest.join(' ');
          $fragment.appendChild($head);
        } else {
          // 그외 복사
          const $clone = $.cloneNode(true);
          $fragment.appendChild($clone);
        }
      }
      $previewContent.appendChild($fragment);
    }

    const clickEdit = () => {
      $edit.classList.remove('unview');
      $edit.classList.add('view');
      $previewContent.classList.add('none');
      $previewContent.innerHTML = '';
      $preview.classList.remove('view');
      $preview.classList.add('unview');
      $content.classList.remove('none');
    }

    const clickPreview = () => {
      $edit.classList.remove('view');
      $edit.classList.add('unview');
      $content.classList.add('none');
      makePreview();
      $preview.classList.remove('unview');
      $preview.classList.add('view');
      $previewContent.classList.remove('none');
    }
    
    const saveEditor = () => {
      if(this.state.hasOwnProperty('id')) {
        debounce(() => {
            $save.classList.remove('save-animation');
            saveDocument({
              liId: this.state.id,
              title: $title.value,
              content : $content.innerHTML
            });
            void $save.offsetWidth;
            $save.classList.add('save-animation');
          }, 500
        );
      }
    }
    
    // DOM
    const $fragment = document.createDocumentFragment();
    const $title = createElement({
      tag: 'input',
      attributes: {
        id: 'DocumentTitle',
        class: 'title'
      }
    });
    const $editPreviewSave = createElement({
      tag: 'div',
      attributes: {
        class: 'edit-preview-save-div'
      }
    });
    const $div = createElement({ tag: 'div' });
    const $edit = createElement({
      tag: 'button',
      attributes: {
        class: 'edit-button view'
      }
    });
    const $preview = createElement({
      tag: 'button',
      attributes: {
        class: 'preview-button unview'
      }
    });
    const $save = createElement({
      tag: 'label',
      attributes: {
        class: 'save-label'
      }
    });
    const $content = createElement({
      tag: 'div',
      attributes: {
        id: 'EditContent',
        class: 'content',
        contenteditable: true
      }
    });
    const $previewContent = createElement({
      tag: 'div',
      attributes: {
        id: 'PreviewContent',
        class: 'content none'
      }
    });

    $edit.textContent = 'Edit file';
    $preview.textContent = 'Preview';

    $title.addEventListener('keydown', saveEditor);
    $edit.addEventListener('click', clickEdit);
    $preview.addEventListener('click', clickPreview);
    $content.addEventListener('keydown', saveEditor);

    $div.appendChild($edit);
    $div.appendChild($preview);
    $editPreviewSave.appendChild($div);
    $editPreviewSave.appendChild($save);

    $fragment.appendChild($title);
    $fragment.appendChild($editPreviewSave);
    $fragment.appendChild($content);
    $fragment.appendChild($previewContent);
    $target.appendChild($fragment);

    init();
  } catch (error) {
    console.log(error);
  }
}