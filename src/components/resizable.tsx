import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

// props type cannot define "children"
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [ screenWidth, setScreenWidth ] = useState(window.innerWidth);
  const [ screenHeight, setScreenHeight ] = useState(window.innerHeight);

  let resizableProps: ResizableBoxProps;

  useEffect(() => {
    const listener = () => {
      let timer: any;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);
      }, 100);
    }

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, []);

  if (direction === 'vertical') {
    resizableProps = {
      width: Infinity,
      // default
      height: 300,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, screenHeight * 0.9],
      minConstraints: [Infinity, 48],
    }
  } else {
    resizableProps = {
      // default
      width: screenWidth * 0.8,
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [screenWidth * 0.8, Infinity],
      minConstraints: [screenWidth * 0.2, Infinity],
      className: 'resize-horizontal'
    }
  }


  // default width and height are 200 and 200 respectively.
  return (
    // to show Resizable box, we must display it in css!!
    <ResizableBox
      { ...resizableProps }

      // we can make the props
      // resizableBox does not support px and %
      // instead "Infinity" === 100%

      // width={Infinity}
      // height={300}
      
      // // only for resizing the bottom side
      // resizeHandles={['s']}
      
      // // [constraint for horizontal, constraint for vertical]
      // maxConstraints={[Infinity, window.innerHeight * 0.9]}
      // minConstraints={[Infinity, 48]}
    >
      {children}
    </ResizableBox>
  );
}

export default Resizable;