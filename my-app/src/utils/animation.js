export const createFlyingElement = (modalElement, endX, endY) => {
    console.log('Creating flying element');
  
    const modalRect = modalElement.getBoundingClientRect();
    const flyingElement = modalElement.cloneNode(true);
    
    // Tính toán vị trí giữa modal
    const centerX = modalRect.left + modalRect.width / 2;
    const centerY = modalRect.top + modalRect.height / 2;
  
    flyingElement.style.position = 'fixed';
    flyingElement.style.left = `${modalRect.left}px`;
    flyingElement.style.top = `${modalRect.top}px`;
    flyingElement.style.width = `${modalRect.width}px`;
    flyingElement.style.height = `${modalRect.height}px`;
    flyingElement.style.zIndex = '9999';
    flyingElement.style.transition = 'all 0.5s ease-in-out';
    flyingElement.style.transform = 'none';
    flyingElement.style.opacity = '1';
  
    document.body.appendChild(flyingElement);
  
    console.log('Flying element appended to body');
  
    // Bước 1: Di chuyển và thu nhỏ ở giữa modal
    setTimeout(() => {
      const scaleFactor = 0.2;
      flyingElement.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
      flyingElement.style.left = `${centerX}px`;
      flyingElement.style.top = `${centerY}px`;
    }, 50);
  
    // Bước 2: Bay vào giỏ hàng
    setTimeout(() => {
      flyingElement.style.transition = 'all 0.5s ease-in-out';
      flyingElement.style.left = `${endX}px`;
      flyingElement.style.top = `${endY}px`;
      flyingElement.style.width = '20px';
      flyingElement.style.height = '20px';
      flyingElement.style.transform = 'translate(0, 0) scale(0.1)';
      flyingElement.style.opacity = '0';
  
      console.log('Flying element animation started');
    }, 550);
  
    setTimeout(() => {
      document.body.removeChild(flyingElement);
      console.log('Flying element removed');
    }, 1100);
  };