import React, { createContext, useContext } from 'react';
import { Elevator } from './Elevator';
import './Elevator.css';
import defaultrequestService from './RequestService';

interface ElevatorLobbyProps{
    elevatorCount?: number;
    foors?: any[];
}

interface ElevatorLobbyState{
    floors: any;
}

export interface ElevatorMetric{
    index: number;
    height: number;
    direction: -1 | 1 | 0;
    stops:{
        top: number;
        bottom: number;
    }
}
export class ElevatorLobby extends React.Component<ElevatorLobbyProps, ElevatorLobbyState>{
    elevators: ElevatorMetric[];
    public newRequestObject: {floor: {} | undefined, elevatorIndex: number} = {floor: undefined, elevatorIndex: -1};

    mtoem = 3;
    MAX_EM_HEIGHT: number;
    FRAME_SPEED =  100;
    EM_STEP: number = 1*this.mtoem/this.FRAME_SPEED;

    constructor(props: ElevatorLobbyProps){
        super(props);

        this.state = {
            floors : [
                {
                    index: 0,
                    height: 0,
                    onwaitUp: false,
                    onwaitDown: false,
                    serviceable: true,
                },
                {
                    index: 1,
                    height: 4,
                    onwaitUp: false,
                    onwaitDown: false,
                    serviceable: true,
                },
                {
                    index: 2,
                    height: 8,
                    onwaitUp: false,
                    onwaitDown: false,
                    serviceable: true,
                },
                {
                    index: 3,
                    height: 12,
                    onwaitUp: false,
                    onwaitDown: false,
                    serviceable: true,
                },
                {
                    index: 4,
                    height: 16,
                    onwaitUp: false,
                    onwaitDown: false,
                    serviceable: true,
                }
            ]
        };

        this.elevators = [...Array(4)].map((x, i)=>(
            {
                index: i,
                height: 0,
                direction: 0,
                stops:{
                    top: -1,
                    bottom: this.state.floors.length
                }
            }
        ));

        this.MAX_EM_HEIGHT = this.state.floors[this.state.floors.length-1].height*this.mtoem;
    }

    private onStop(){
        const disabledFloor = this.state.floors.map((f: any) => ({...f, serviceable: false}));
        this.setState({...this.state, floors: disabledFloor});

        this.elevators.forEach((e)=> {
            defaultrequestService.requestBehavior.dispatch({floor: this.state.floors[0], direction: 0, elevatorIndex: e.index});
        })
    }

    public async onRequest(index: number, direction: 1 | -1){
        if ((direction === 1 && this.state.floors[index].onwaitUp) || (direction === -1 && this.state.floors[index].onwaitDown)){
            return;
        }
        await this.setState({
            floors: this.state.floors.map((f: any, i: number) => (i=== index? (direction === 1? {...f, onwaitUp: true}: {...f, onwaitDown: true}): f))
        });
        defaultrequestService.requestBehavior.dispatch({floor: this.state.floors[index], direction, elevatorIndex: this.elevatorOnPriority(index, direction)});
        // this.context.newRequest = {floor: this.state.floors[index], elevatorIndex: Math.floor(Math.random()*(this.state.floors.length))};
        // Math.floor(Math.random()*(this.elevators.length))
    }

    private elevatorOnPriority(index: number, direction: 1 | -1){
        const weightList  = this.elevators.map(e => {
            let weight;
            if (e.direction === 1){
                if (this.state.floors[index].height*this.mtoem > e.height){
                    if (direction === 1){
                        weight = this.state.floors[index].height*this.mtoem - e.height
                    }else{
                        weight = 2*e.stops.top-(this.state.floors[index].height*this.mtoem + e.height)
                    }
                }else{
                    if (direction === 1){
                        weight = 2*(e.stops.top- e.stops.bottom) - e.height + this.state.floors[index].height*this.mtoem;
                    }else{
                        weight = 2*e.stops.top-(this.state.floors[index].height*this.mtoem + e.height)
                    }
                }
            }else if(e.direction === -1){
                if (this.state.floors[index].height*this.mtoem < e.height){
                    if (direction === -1){
                        weight = e.height - this.state.floors[index].height*this.mtoem;
                    }else{
                        weight = (this.state.floors[index].height*this.mtoem + e.height) - 2*e.stops.bottom;
                    }
                }else{
                    if (direction === -1){
                        weight = 2*(e.stops.top- e.stops.bottom) + e.height - this.state.floors[index].height*this.mtoem;
                    }else{
                        weight = (this.state.floors[index].height*this.mtoem + e.height) -2*e.stops.bottom;
                    }
                }
            }else{
                weight = this.state.floors[index].height*this.mtoem - e.height;
            }

            return - Math.abs(weight);
        });

        const maxw = weightList.reduce((pre, cur, index)=> {
            if (pre.val < cur){
                pre.val = cur;
                pre.index = index
            }
            return pre;
        }, {val: -999, index: -1});

        return maxw.index;
    }
    public handleFloorChange(param: {floorIndex: number; direction: 1 | -1}){
        
        this.setState({
            floors: this.state.floors.map((f: any, i: number) => (i === param.floorIndex? (param.direction ===1 ? {...f, onwaitUp: false}: {...f, onwaitDown: false}): f))
        })
    }

    public onMetricChange(elevator: ElevatorMetric){
        this.elevators[elevator.index] = elevator;
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className='position-relative d-flex justify-content-center'>
                    {
                        this.elevators.map((e, i) => (
                            <div className='m-3' key={`elevator-${i}`}>
                                <Elevator
                                    index = {i}
                                    mtoem={this.mtoem}
                                    frameSpeed={this.FRAME_SPEED}
                                    floors={this.state.floors}
                                    onFloorChange={this.handleFloorChange.bind(this)}
                                    onMetricChange={this.onMetricChange.bind(this)}
                                />
                            </div>
                        ))
                    }
                    <div>
                        {
                            this.state.floors.map((f: any, index: number) => (
                                <div key={`floor-${index}`}  className='position-absolute' style={{bottom: `${f.height*this.mtoem -0.7}em`}}>
                                    <button className='btn btn-primary m-2' onClick={()=> {this.onRequest(index, -1)}} disabled={!this.state.floors[index].serviceable}>
                                        <i className='bi bi-arrow-down-short'></i>
                                        <i className='bi bi-hourglass-split' hidden={!f.onwaitDown}></i>
                                    </button>

                                    <button className='btn btn-primary m-2' onClick={()=> {this.onRequest(index, 1)}}  disabled={!this.state.floors[index].serviceable}>
                                        <i className='bi bi-arrow-up-short'></i>
                                        <i className='bi bi-hourglass-split' hidden={!f.onwaitUp}></i>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='m-2'>
                    <button className='btn btn-danger' onClick={()=>{this.onStop()}} disabled={!this.state.floors[0].serviceable}>
                        Stop
                    </button>
                </div>
            </div>
        )
    }
}