document.getElementById('scrapeBtn').addEventListener('click', () => {
    window.electronAPI.scrapePage().then(() => {
      console.log('Scraping terminé !');
    }).catch((error) => {
      console.error('Erreur lors du scraping :', error);
    });
  });
  