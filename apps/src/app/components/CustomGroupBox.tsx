type CustomGroupProps = {
  title: string;
};
export default function CustomGroupBox({
  children,
  title,
}: React.PropsWithChildren<CustomGroupProps>) {
  return (
    <div style={{border:'1px solid black', padding:'10px', position:'relative', borderRadius:5, marginTop:"20px"}}>
        <label style={{position:'absolute', top:-10, backgroundColor:'white', padding:'2px 5px 2px 5px', borderRadius:5}}>{title}</label>
        <div style={{margin:'10px', display:'flex', flexDirection:'column', gap:10}}>{children}</div>
    </div>
  );
}
