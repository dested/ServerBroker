using System;
using System.Text;

namespace OnPoolCommon
{
    internal class WorkerResponse
    {
        public WorkerResult Result { get; set; }
        public byte[] Message { get; set; }

        private WorkerResponse()
        {
        }

        public static WorkerResponse Disconnect()
        {
            return new WorkerResponse { Result = WorkerResult.Disconnect };
        }

        public static WorkerResponse FromMessage(byte[] continueBuffer, int len)
        {
            var bytes = new byte[len];
            Buffer.BlockCopy(continueBuffer, 0, bytes, 0, len);
            return new WorkerResponse { Result = WorkerResult.Message, Message = bytes };
        }
    }

    internal enum WorkerResult
    {
        Message,
        Disconnect
    }
}