import React from 'react';
import './Elevator.css';

interface ElevatorProps{
    floors: {height: number};
    onFloorChange: (floor: any) => void;
}

interface ElevatorState{
    floors: {height: number; onwait: boolean;}[];
    height: number; 
    direction: -1 | 0 | 1;
}

export class Elevator extends React.Component<ElevatorProps, ElevatorState>{
    boxRef: React.RefObject<HTMLDivElement>;
    motion: NodeJS.Timeout | undefined = undefined;

    mtoem = 3;
    MAX_EM_HEIGHT: number;
    FRAME_SPEED =  100;
    EM_STEP: number = 1*this.mtoem/this.FRAME_SPEED;
    stopageStack: {height: number; onwait: boolean;}[];

    constructor(props: ElevatorProps){
        super(props);
        this.state = {
            height: 0,
            direction: 0,
            floors: [
                {
                    height: 0,
                    onwait: false
                },
                {
                    height: 4,
                    onwait: false
                },
                {
                    height: 8,
                    onwait: false
                },
                {
                    height: 12,
                    onwait: false
                },
                {
                    height: 16,
                    onwait: false
                }
            ]
        }
        this.MAX_EM_HEIGHT = this.state.floors[this.state.floors.length-1].height*this.mtoem;
        this.stopageStack = [];
        this.boxRef = React.createRef<HTMLDivElement>();
    }

    public handleStart(floorIndex: number){
        const floor = this.state.floors[floorIndex];
        floor.onwait = true;
        if (this.state.direction !==0 && this.motion){
            let pre = this.state.height;
            let i;
            for (i = this.stopageStack.length-1; i>= 0; i--){
                if ((pre< floor.height && floor.height < this.stopageStack[i].height) || (pre> floor.height && floor.height > this.stopageStack[i].height)){
                    break;
                }
                pre = this.stopageStack[i].height;
            }
            this.stopageStack.splice(i+1, 0, floor);
            this.setState({...this.state});
            return;
        }
        this.stopageStack.push(floor);
        const direction = floor.height - this.state.height > 0 ? 1: -1;
        this.setState({...this.state, direction});
        this.motion = setTimeout(this.nextStep.bind(this), 1000/this.FRAME_SPEED);
    }

    private nextStep(){
        if (this.state.direction === 0 && this.motion){
            clearTimeout(this.motion);
            this.motion = undefined;
        }
        else{
            let newHeight = this.state.height+ this.state.direction*this.EM_STEP;
            let newdirection = this.state.direction;
            let delay = 1000/this.FRAME_SPEED;

            if(Math.abs(this.stopageStack[this.stopageStack.length-1].height*this.mtoem - newHeight) < this.EM_STEP){
                const currentFloor = this.stopageStack.pop();
                (currentFloor|| {onwait: true}).onwait = false;
                newHeight = currentFloor? currentFloor.height*this.mtoem : newHeight;
                newdirection = this.stopageStack.length > 0?((this.stopageStack[this.stopageStack.length-1].height*this.mtoem - newHeight) > 0? 1: -1): 0;
                delay = 2000;
            }
            else if (newHeight > this.MAX_EM_HEIGHT){
                newHeight = this.MAX_EM_HEIGHT;
                delay = 2000;
                newdirection = this.stopageStack.length > 0? -1: 0;

            }
            else if(newHeight < 0){
                newHeight = 0;
                delay = 2000;
                newdirection = this.stopageStack.length > 0? 1: 0;
            }

            this.setState({...this.state, height: newHeight, direction: newdirection})
            this.motion = setTimeout(this.nextStep.bind(this), delay);
        }
    }

    public handleStop(){
        this.setState({...this.state, direction: 0});
    }

    public render(): React.ReactNode {
        return (
            <div className='container border h-100'>
                
                <div  className='d-flex justify-content-center align-items-center mt-5'>
                    <div className='column position-relative border' style={{height: `${this.MAX_EM_HEIGHT}em`}}>
                        {
                            this.state.floors.map((f, index) => (
                                <div className='position-absolute' key={`floor-${index}`} style={{bottom: `${f.height*this.mtoem -0.7}em`, right: '-3em'}}>
                                    <button className='btn' onClick={()=> {this.handleStart(index)}}>
                                        <i className='bi bi-stop-circle-fill'></i>
                                        <i className='bi bi-hourglass-split' hidden={!f.onwait}></i>
                                    </button>
                                </div>
                            ))
                        }
                        <div ref={this.boxRef} className='box position-absolute' style={{bottom: `${this.state.height}em`, left: '0.2em'}}></div>
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center mt-5'>
                    <button className='btn btn-danger m-2' onClick={()=> this.handleStop()}>
                        Stop
                    </button>
                </div>
                

            </div>
        )
    }
}