function Room(value: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDecorator,
    ) {
        console.log(value);
    };
}
