using System.Collections.Generic;

namespace BrokerCommon
{
    public class LocalThreadManager
    {
        private static LocalThreadManager _instance;
        private bool alive { get; set; }

        private LocalThreadManager()
        {
            alive = true;
        }

        public static LocalThreadManager Start()
        {
            return _instance = new LocalThreadManager();
        }
        private List<ILocalBackgroundWorker> workers = new List<ILocalBackgroundWorker>();

        public static LocalThreadManager GetInstance()
        {
            return _instance;
        }

        public void Process()
        {
            while (alive)
            {

                var tempWorkers = workers.ToArray();
                foreach (var worker in tempWorkers)
                {
                    object response;
                    while ((response = worker.TryGetResponse()) != null)
                    {
                        worker.ProcessResponseMainThread(response);
                    }
                }

            }
        }


        public void AddWorker(ILocalBackgroundWorker worker)
        {
            this.workers.Add(worker);
        }

        public void Kill()
        {
            this.alive = false;
        }
    }
}