module.exports = {
  rules: {
    'ticket-number-check': [2, 'always', /^[A-Z]+-\d+: .+/],
  },
  plugins: [
    {
      rules: {
        'ticket-number-check': (parsed) => {
          const { header } = parsed; // Access the header from the commit message
          const pattern = /^[A-Z]+-\d+: .+/;
          if (!header) {
            return [false, 'Commit message is missing!'];
          }
          if (!pattern.test(header.trim())) {
            return [
              false,
              'Commit message MUST begin with a ticket number, following this format: `XYZ-12: Your message here`\nFor Ex:=> `TASK-120: Work on User Module - [Status: Done]`',
            ];
          }
          return [true];
        },
      },
    },
  ],
};
