import FAQ from "@/components/FAQ";

export default function FrequestlyAskQuestions() {
  return (
    <div className="w-full p-2">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Quick answers to common questions about our services.
            </p>
          </div>
          <div>
            <FAQ full={true} />
          </div>
        </div>
      </section>
    </div>
  );
}
