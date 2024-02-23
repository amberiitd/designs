import React from 'react';
import './Elevator.css';
import { ElevatorMetric } from './ElevatorLobby';
import defaultrequestService from './RequestService';

interface ElevatorProps{
    index: number;
    mtoem: number;
    frameSpeed: number;
    floors: any;
    onFloorChange: (param: {floorIndex: number; direction: 1 | -1}) => void;
    onMetricChange: (metric: ElevatorMetric) => void;
}

interface ElevatorState{
    height: number; 
    direction: -1 | 0 | 1;
    floorRequest: {index: number, up: boolean, down: boolean}[];
}

export class Elevator extends React.Component<ElevatorProps, ElevatorState>{

    boxRef: React.RefObject<HTMLDivElement>;
    motion: NodeJS.Timeout | undefined = undefined;
    MAX_EM_HEIGHT: number;
    EM_STEP: number;
    stopage: {floor: any; direction: 1 | -1;} | undefined;
    
    requestSubscription: string | undefined;
    constructor(props: ElevatorProps){
        super(props);
        this.state = {
            height: 0,
            direction: 0,
            floorRequest: this.props.floors.map((f: any) => ({index: f.index, up: false, down: false}))
        }
        this.MAX_EM_HEIGHT = this.props.floors[this.props.floors.length-1].height*this.props.mtoem;
        this.EM_STEP = 1*this.props.mtoem/this.props.frameSpeed;
        this.boxRef = React.createRef<HTMLDivElement>();
    }

    public componentDidMount(): void {
        if (!this.requestSubscription){
            this.requestSubscription = defaultrequestService.requestBehavior.subscribe(this.handleRequest.bind(this));
        }
    }

    public handleRequest(data: any){
        if (data.elevatorIndex !== this.props.index){
            return;
        }
        const floor = this.props.floors.find((f: any) => f.index === data.floor.index);
        const direction = floor.height*this.props.mtoem - this.state.height > 0 ? 1: -1;

        if (data.direction == 1){
            this.state.floorRequest[data.floor.index].up = true;
        }else{
            this.state.floorRequest[data.floor.index].down = true;
        }
        
        if (this.state.direction !==0 && this.motion){
            if (this.stopage 
                && ((this.state.height < floor.height && floor.height < this.stopage.floor.height) || (this.state.height > floor.height && floor.height > this.stopage.floor.height)) 
                && this.state.direction === data.direction
            ){
                this.stopage = {floor, direction: data.direction};
            }
            return;
        }

        this.stopage = {floor, direction: data.direction};
        this.setState({...this.state, direction});
        this.motion = setTimeout(this.nextStep.bind(this), 1000/this.props.frameSpeed);
        
    }

    private floorLimits(){
        let mini;
        for (mini = 0; mini< this.state.floorRequest.length && !this.state.floorRequest[mini].up && !this.state.floorRequest[mini].down; mini++);

        let maxi;
        for (maxi = this.state.floorRequest.length-1; maxi>=0 && !this.state.floorRequest[maxi].up && !this.state.floorRequest[maxi].down; maxi--);

        return {
            top: maxi,
            bottom: mini
        }

    }

    private nextStep(){
        if (this.state.direction === 0 && this.motion){
            clearTimeout(this.motion);
            this.motion = undefined;
        }
        else{
            let newHeight = this.state.height;
            let newdirection = this.state.direction;
            let delay = 1000/this.props.frameSpeed;

            if(this.stopage&& Math.abs(this.stopage.floor.height*this.props.mtoem - newHeight) < this.EM_STEP){
                console.log('arrived'+ this.stopage)
                if(this.stopage.direction === 1){
                    this.state.floorRequest[this.stopage.floor.index].up = false;
                    this.stopage.floor.onwaitUp = false;
                }else{
                    this.state.floorRequest[this.stopage.floor.index].down = false;
                    this.stopage.floor.onwaitDown = false;
                }
                
                this.props.onFloorChange({
                    floorIndex: this.stopage.floor.index, 
                    direction: this.stopage.direction,
                });
                newHeight = this.stopage.floor.height*this.props.mtoem || newHeight;

                if(this.state.direction ===1){
                    let i = this.stopage.floor.index+1;
                    while(i< this.state.floorRequest.length && !this.state.floorRequest[i].up){i++}
                    if (i < this.state.floorRequest.length){
                        this.stopage = {floor: this.props.floors[i], direction: 1};
                    }else{
                        i= this.state.floorRequest.length -1;
                        while(i>=0 && !this.state.floorRequest[i].down){i--}
                        if (i >=0){
                            this.stopage = {floor: this.props.floors[i], direction: -1};
                        }else{
                            i= 0;
                            while(i < this.stopage.floor.index+1 && !this.state.floorRequest[i].up){i++}
                            if (i < this.stopage.floor.index+1){
                                this.stopage = {floor: this.props.floors[i], direction: 1};
                            }else{
                                this.stopage = undefined;
                            }
                        }
                    }
                    console.log(i)

                }else{
                    let i = this.stopage.floor.index-1;
                    while(i >=0 && !this.state.floorRequest[i].down){i--}
                    if (i >=0){
                        this.stopage = {floor: this.props.floors[i], direction: -1};
                    }else{
                        i= 0;
                        while(i< this.state.floorRequest.length && !this.state.floorRequest[i].up){i++}
                        if (i < this.state.floorRequest.length){
                            this.stopage = {floor: this.props.floors[i], direction: 1};
                        }else{
                            i= this.state.floorRequest.length -1;
                            while(i > this.stopage.floor.index -1 && !this.state.floorRequest[i].down){i--}
                            if (i > this.stopage.floor.index -1){
                                this.stopage = {floor: this.props.floors[i], direction: -1};
                            }else{
                                this.stopage = undefined;
                            }
                        }
                    }
                    console.log(i)
                }
                console.log(this.stopage)
                newdirection = this.stopage?((this.stopage.floor.height*this.props.mtoem - newHeight) > 0? 1: -1): 0;
                delay = 2000;
            }
            else if (newHeight > this.MAX_EM_HEIGHT){
                newHeight = this.MAX_EM_HEIGHT;
                delay = 2000;
                newdirection = this.stopage ? -1: 0;

            }
            else if(newHeight < 0){
                newHeight = 0;
                delay = 2000;
                newdirection = this.stopage? 1: 0;
            }else{
                newHeight = this.state.height+ this.state.direction*this.EM_STEP;
            }

            this.props.onMetricChange({
                index: this.props.index,
                height: newHeight,
                direction: newdirection,
                stops: this.floorLimits()
            })
            this.setState({...this.state, height: newHeight, direction: newdirection})
            this.motion = setTimeout(this.nextStep.bind(this), delay);
        }
    }

    public handleStop(){
        this.setState({...this.state, direction: 0});
    }

    public render(): React.ReactNode {
        return (
            <div className='border h-100'>
                
                <div  className='d-flex justify-content-center align-items-center mt-5'>
                    <div className='column position-relative border' style={{height: `${this.MAX_EM_HEIGHT}em`}}>
                        <div ref={this.boxRef} className='box position-absolute' style={{bottom: `${this.state.height}em`, left: '0.2em'}}></div>
                        <div className='position-absolute' style={{bottom: '0'}}>
                            {
                                Array.from({length: this.props.floors.length}, (_, i2)=> i2).reverse().map((x) => (
                                    <div className='m-2'  key={`floor-buuton-${x}`}>
                                        <button className='btn btn-success' 
                                            onClick={()=> {this.handleRequest({floor: this.props.floors[x], direction: 1, elevatorIndex: this.props.index})}}
                                            disabled={this.state.floorRequest[x].up || this.state.floorRequest[x].down}
                                        >
                                            {x}
                                        </button>
                                    </div>
                                    
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* <div className='d-flex justify-content-center align-items-center mt-5'>
                    <button className='btn btn-danger m-2' onClick={()=> this.handleStop()}>
                        Stop
                    </button>
                </div> */}
                

            </div>
        )
    }
}