import "./index.css";

const Box: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="box">{children}</div>;
};

export default Box;
