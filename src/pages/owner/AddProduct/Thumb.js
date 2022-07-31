import React from "react";

export default class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) { return; }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file);
    });
  }

  render() {
    const { file } = this.props;
    const { loading, thumb } = this.state;

    if (!file) { return null; }

    if (loading) { return <p>loading...</p>; }

    return (<span>
                <img  style={{padding:"2px", borderRadius:"5px", border:"1px solid #000000", margin:"1px", height:"20%", width:"20%"}}
                      src={thumb}
                      alt={file.name}
                      />
            </span>);
  }
}