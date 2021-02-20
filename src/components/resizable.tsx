import { ResizableBox } from 'react-resizable';
import './resizable.css';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

// props type cannot define "children"
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  // default width and height are 200 and 200 respectively.
  return (
    // to show Resizable box, we must display it in css!!
    <ResizableBox
      width={300}
      height={300}
      // only for resizing the bottom side
      resizeHandles={['s']}
    >
      {children}
    </ResizableBox>
  );
}

export default Resizable;