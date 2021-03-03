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
  const [ width, setWidth ] = useState(window.innerWidth * 0.8);

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

        // if left side is greater than 80%
        //  which means that right side is less than 20% or is disappeared
        //  build a right side for 20%
        if (window.innerWidth * 0.8 < width) {
          setWidth(window.innerWidth * 0.8);  
        }
      }, 100);
    }

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    }
  }, [width]);

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
      // [updating]
      // the point where the current draggable bar is located at
      // the point's width size must be updated when the draggable bar stops.
      // otherwise, the draggable bar will reset again to the default value, window.innerWidth * 0.8.
      width,
      // width: window.innerWidth * 0.8,
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [screenWidth * 0.8, Infinity],
      minConstraints: [screenWidth * 0.2, Infinity],
      className: 'resize-horizontal',
      onResizeStop: (event, data) => { 
        // getting left side size                                                         updating
        console.log(data);                                                     //             ^
        // onResizeStop: the point when the draggable bar stops.                              |      
        // draggable bar's left side (code editor)                                            |
        // ===> it must make "ResizableBox" from resizable component    ------------------
        //  because ResizableBox does not know the stopped point.
        setWidth(data.size.width);
      }
    }
  }

  // default width and height are 200 and 200 respectively.
  return (
    // to show Resizable box, we must display it in css!!
    <ResizableBox
      { ...resizableProps }

      // It is only for vertical example
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