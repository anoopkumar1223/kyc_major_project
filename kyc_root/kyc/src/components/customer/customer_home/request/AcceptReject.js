function AcceptReject(props) {
  function onAccept() {
    props.onAccept(props.index);
  }
  function onReject() {
    props.onReject(props.index);
  }
  return (
    <div className="AcceptReject">
      <div
        className="col"
        style={{
          margin: "25px 20px",
        }}
      >
        <div style={{}}>
          <h4>Bank name: {props.request.bankName}</h4>
          <h4>ETH Address: {props.request.bankAddress}</h4>
        </div>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            onAccept();
          }}
        >
          Accept
        </button>
        <button
          type="button"
          className="btn btn-danger"
          style={{
            marginLeft: "10px",
          }}
          onClick={() => {
            onReject();
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default AcceptReject;
