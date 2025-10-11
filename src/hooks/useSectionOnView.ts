"use client";


const useSectionOnView = () => {
  
  const sectionOnView = (target: HTMLElement | null) => { 
    if (!target) return false;
    const rect = target.getBoundingClientRect();
    return ( 
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2       
    );
  };

  return sectionOnView;   
}

export default useSectionOnView;
