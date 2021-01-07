/*eslint-disable*/
import React from 'react';
import Css from './head.css';
import { withRouter } from 'react-router';
class  HeadComponent extends React.Component{
    constructor(props){
        super(props);
    }

    goBack() {
        this.props.history.goBack();
    }
    render(){ 
        return(
                <div className={Css['top-wrap']}>
                    <div className={Css['back-icon']} onClick={this.goBack.bind(this)}></div>
                    <div className={Css['title']}>{this.props.title}</div>
                    {this.props.rightText !== undefined ?
                        <div className={Css['right-text']} onClick={this.props.rightClick}>{this.props.rightText}</div>
                    :''
                    }
                    
                </div>
        );
    }
}

export default withRouter(HeadComponent)