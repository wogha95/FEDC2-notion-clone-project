import DocumentList from './DocumentList.js';
import DocumentContent from './DocumentContent.js';
import { request } from '../utils/api.js';
import { createElement } from '../utils/createElement.js';
import { APP_NEW_ERROR } from '../utils/error.js';

export default function({ $target }) {
  try {
    if(!new.target) throw new Error(APP_NEW_ERROR);

    const init = async () => {
      const initialState = await request('./documents');

      this.document = {};

      this.DocumentList = new DocumentList({
        $target: $DocumentList,
        initialState,
        clickDocument,
        addDocument,
        deleteDocument
      })
  
      this.DocumentContent = new DocumentContent({
        $target: $DocumentContent,
        initialState: {
          title: '',
          content: ''
        },
        saveDocument
      })

      // history
      const path = '/documents';
      pushHistoryState(path);
    }

    const checkDocument = (documentId = null) => {
      if(!documentId) this.document = {};

      this.DocumentList.checkState(documentId);
    }
    
    const getDocument = async (documentId) => {
      this.document = await request(`/documents/${documentId}`);
      this.DocumentContent.setstate(this.document);
    }

    const clickDocument = (documentId, path, isVisited = false) => {
      if (this.document.hasOwnProperty('id') && this.document.id === Number(documentId)) return ;
      if (!isVisited) pushHistoryState(path);

      checkDocument(documentId);
      getDocument(documentId);
    }

    const addDocument = async (liId = null) => {
      const response = await request('/documents', {
        method: 'POST',
        body: JSON.stringify({
          title: (liId ? '하위 제목' : '루트 제목'),
          parent: liId
        })
      });

      const newDocument = {
        id: response.id,
        title: response.title,
        documents: []
      }

      this.DocumentList.addState(newDocument, liId);
      clickDocument(newDocument.id);
    }

    const deleteDocument = async (liId) => {
      const response = await request(`/documents/${liId}`, {
        method: 'DELETE'
      });

      if(this.document.hasOwnProperty('id') && this.document.id === response.id) {
        checkDocument();
      }
      
      this.DocumentList.deleteState(response.id);
    }

    const saveDocument = async ({ liId, title, content }) => {
      const response = await request(`/documents/${liId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title, content
        })
      });

      this.DocumentList.saveState(response.id, response.title);
    }
    
    // DOM
    const $fragment = document.createDocumentFragment();
    const $DocumentList = createElement({
      tag: 'nav',
      attributes: {
        id: 'DocumentList'
      }
    });
    const $DocumentContent = createElement({
      tag: 'article',
      attributes: {
        id: 'DocumentContent'
      }
    });
    
    $fragment.appendChild($DocumentList);
    $fragment.appendChild($DocumentContent);
    $target.appendChild($fragment);

    init();
    
    // history
    const pushHistoryState = (path) => {
      history.pushState(null, null, path);
    }

    const popHistoryState = () => {
      const path = location.pathname;
      const [, , , liId = null] = path.split('/');
      if(liId) clickDocument(liId, path, true);
    }
    
    window.addEventListener('popstate', popHistoryState);

    // paste 금지
    window.addEventListener('paste', (event) => {
      event.stopPropagation();
      event.preventDefault();
    })
  } catch (error) {
    console.log(error);
  }
}