function all(a: number) {
    const result = {
        prop: a,
        result: 2,
        message: 'All passed',
    };

    return result['message'];
}
all(2);
