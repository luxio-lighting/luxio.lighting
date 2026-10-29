const controllersDialog = document.querySelector('#controllers-dialog');
const controllersLink = document.querySelector('.controllers-link');

controllersLink.addEventListener('click', () => controllersDialog.showModal());
controllersDialog.querySelector('.controllers-close').addEventListener('click', () => controllersDialog.close());
controllersDialog.addEventListener('close', () => controllersLink.focus());
controllersDialog.addEventListener('click', event => {
  const bounds = controllersDialog.getBoundingClientRect();
  if (event.target === controllersDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    controllersDialog.close();
  }
});

const controllerHeaders = [...controllersDialog.querySelectorAll('th')];
const controllerRows = controllersDialog.querySelector('tbody');
for (const [column, header] of controllerHeaders.entries()) {
  header.querySelector('button').addEventListener('click', () => {
    const direction = header.getAttribute('aria-sort') === 'ascending' ? -1 : 1;
    for (const other of controllerHeaders) other.removeAttribute('aria-sort');
    header.setAttribute('aria-sort', direction === 1 ? 'ascending' : 'descending');
    const rows = [...controllerRows.rows];
    rows.sort((a, b) => {
      const left = a.cells[column];
      const right = b.cells[column];
      if (left.dataset.sort !== undefined) return direction * (Number(left.dataset.sort) - Number(right.dataset.sort));
      const leftText = left.querySelector('a')?.href ?? left.textContent.trim();
      const rightText = right.querySelector('a')?.href ?? right.textContent.trim();
      return direction * leftText.localeCompare(rightText, 'en', { numeric: true, sensitivity: 'base' });
    });
    controllerRows.append(...rows);
  });
}
