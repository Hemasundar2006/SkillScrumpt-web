const axios = require('axios');

/**
 * @desc    Proxy code execution to onlinecompiler.io
 * @route   POST /api/v1/compiler/run
 * @access  Private
 */
exports.runCode = async (req, res) => {
  try {
    const { compiler, code, input } = req.body;

    const response = await axios.post('https://api.onlinecompiler.io/api/run-code-sync/', {
      compiler,
      code,
      input
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.ONLINE_COMPILER_KEY || 'd84ad1b74006567a756e106544b35896'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Compiler Proxy Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Code execution failed through proxy',
      error: error.response?.data || error.message
    });
  }
};
