export default () => {
  return (
    <div
      className="container"
      style={{
        width: '100px',
        height: '50px',
        background: 'red',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="drag-handle custom-drag-handle"
        style={{
          display: 'inline-block',
          width: '25px',
          height: '25px',
          backgroundColor: 'green',
        }}
      />
    </div>
  );
};
