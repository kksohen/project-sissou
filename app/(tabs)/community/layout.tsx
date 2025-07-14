export default function CommunityLayout({children, modal}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}){
  // console.log('Modal content:', modal);
  return(
    <>
    {children}
    {modal}
    </>
  );
};