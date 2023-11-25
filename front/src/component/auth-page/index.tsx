import "./index.css";

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="page auth-page">{children}</div>;
};

export default Page;
