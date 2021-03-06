import { Input } from './interface';
import InputFactory from './input/InputFactory';
export default class {
    // 起点(单点|多点)
    startInput?: Input;
    // 前一次的触电
    prevInput?: Input;
    // 当前触点
    activeInput?: Input;
    // 多点触碰的起点
    startMutliInput?: Input;

    inputFactory: InputFactory;

    constructor() {
        this.inputFactory = new InputFactory();
    };


    load(event: Event): {
        startInput?: Input,
        prevInput?: Input,
        input?: Input,
        startMutliInput?: Input
    } | void {
        // 格式化不同设备输入数据
        const input = this.inputFactory.load(event);

        // 无效的输入    
        if (undefined === input) return;

        // 当前输入状态
        const { eventType } = input;

        // [Start]
        if ('start' === eventType) {
            // 上一步的触点
            // prevInput = undefined;
            // 当前点
            this.activeInput = input;
            // 起点(单点|多点)
            this.startInput = input;
            // 起点(多点)
            if (1 < input.pointLength) {
                this.startMutliInput = input;
            } else {
                // 如果出现了单点, 那么之前的多点起点记录失效
                this.startMutliInput = undefined;
            }
        } else if ('move' === eventType) {
            // 读取上一点
            this.prevInput = this.activeInput;
            this.activeInput = input;
        } else if ('end' === eventType) {
            this.prevInput = this.activeInput;
            this.activeInput = input;
            // console.log(this.startInput, this.el.id);
        }
        return {
            startMutliInput: this.startMutliInput,
            startInput: this.startInput,
            prevInput: this.prevInput,
            input
        };
    };
}; 