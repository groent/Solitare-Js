const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.container')
let draggableSuitValue, draggableSuitValueNode
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
    draggableSuitValue = draggable.getAttribute('data-value');
    draggableSuitValueNode = draggable.getAttributeNode('data-value');
    console.log(draggableSuitValue);
    
    return draggableSuitValue, draggableSuitValueNode
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
    
  });
});

containers.forEach(container => {
  container.addEventListener( 'dragover',  e => {
    e.preventDefault()
    const afterElement = getDragAfterElement( container, e.clientY, draggableSuitValue)
    
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(  draggable, afterElement, draggableSuitValueNode)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

