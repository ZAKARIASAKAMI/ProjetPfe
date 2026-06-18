import { useEffect } from 'react';

const PageMeta = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | FlowStock` : 'FlowStock';
  }, [title]);

  return null;
};

export default PageMeta;
