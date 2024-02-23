import { SimpleSubscription } from "../../SimpleSubscription";

class RequestService{
    public requestBehavior: SimpleSubscription =  new SimpleSubscription();
}

const defaultrequestService = new RequestService();

export default defaultrequestService;
