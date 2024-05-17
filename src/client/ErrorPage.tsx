/** 
 * page to display when the user tries to access a page that does not exist
 */
export function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <i className="fas fa-exclamation-circle fa-lg"></i>
      <h1>Error 404</h1>
      <div style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }}>The page you searched is not there</div>
    </div>
  );
};

