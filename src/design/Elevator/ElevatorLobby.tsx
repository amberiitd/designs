import React, { createContext, useContext } from 'react';
import { Elevator } from './Elevator';
import './Elevator.css';

interface ElevatorLobbyProps{
    elevatorCount?: number;
    foors?: any[];
}

interface ElevatorLobbyState{
    floors: any;
}

export const RequestContext = createContext<{
    newRequest: any;
}>({
    newRequest: {}, 
});

export class ElevatorLobby extends React.Component<ElevatorLobbyProps, ElevatorLobbyState>{
    declare context: React.ContextType<typeof RequestContext>
    elevators: any[];
    public newRequestObject: {floor: {} | undefined, elevatorIndex: number} = {floor: undefined, elevatorIndex: -1};
    constructor(props: ElevatorLobbyProps){
        super(props);
        this.elevators = [...Array(2)].map(()=>(
            {
                height: 0,
                direction: 0
            }
        ));

        this.state = {
            floors : [
                {
                    height: 0,
                    onwaitUp: false,
                    onwaitDown: false,
                },
                {
                    height: 4,
                    onwaitUp: false,
                    onwaitDown: false,
                },
                {
                    height: 8,
                    onwaitUp: false,
                    onwaitDown: false,
                },
                {
                    height: 12,
                    onwaitUp: false,
                    onwaitDown: false,
                },
                {
                    height: 16,
                    onwaitUp: false,
                    onwaitDown: false,
                }
            ]
        };
    }

    private onStop(state: any){

    }

    public onRequest(index: number, direction: 1 | -1){
        if ((direction === 1 && this.state.floors[index].onwaitUp) || (direction === -1 && this.state.floors[index].onwaitDown)){
            return;
        }
        this.setState({
            floors: this.state.floors.map((f: any, i: number) => (i=== index? (direction === 1? {...f, onwaitUp: true}: {...f, onwaitDown: true}): f))
        });
        this.newRequestObject = {floor: this.state.floors[index], elevatorIndex: Math.floor(Math.random()*(this.state.floors.length))};
    }

    public handleFloorChange(floor: any){
        this.setState({
            floors: this.state.floors.map((f: any, i: number) => (f.height=== floor.height? floor: f))
        })
    }

    public render(): React.ReactNode {
        return (
            <RequestContext.Provider value={{newRequest: this.newRequestObject}}>
                {
                    this.elevators.map((e, i) => (
                        <div key={`elevator-${i}`}>
                            <Elevator
                                floors={this.state.floors}
                                onFloorChange={this.handleFloorChange.bind(this)}
                            />
                        </div>
                    ))
                }
            </RequestContext.Provider>
        )
    }
}