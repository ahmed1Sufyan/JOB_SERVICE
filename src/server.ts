function all(a: number) {
    const result = {
        prop: a,
        result: 2,
        message: 'All passed',
    };
    // eslint-disable-next-line no-console
    console.log(result.message);

    return result['message'];
}
all(2);
