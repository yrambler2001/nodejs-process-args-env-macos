#include <nan.h>
#include <sys/sysctl.h>

size_t size;

int managementInformationBase[3];
int maximumBytesOfArgument;
char* processArguments;

void Process(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

  processArguments = (char*)malloc(maximumBytesOfArgument);
  if (processArguments == NULL) {
    Nan::ThrowTypeError("1. malloc failed");
  }

  managementInformationBase[0] = CTL_KERN;
  managementInformationBase[1] = KERN_PROCARGS2;
  managementInformationBase[2] = info[0]->NumberValue(context).FromJust();

  size = (size_t)maximumBytesOfArgument;
  if (sysctl(managementInformationBase, 3, processArguments, &size, NULL, 0) == -1) {
    Nan::ThrowTypeError("2. sysctl failed");
  }

  info.GetReturnValue().Set(Nan::NewBuffer(processArguments, size).ToLocalChecked());
}

void Init(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context =
      exports->GetCreationContext().ToLocalChecked();
  exports->Set(context,
               Nan::New("process").ToLocalChecked(),
               Nan::New<v8::FunctionTemplate>(Process)
                   ->GetFunction(context)
                   .ToLocalChecked());

  managementInformationBase[0] = CTL_KERN;
  managementInformationBase[1] = KERN_ARGMAX;

  size = sizeof(maximumBytesOfArgument);
  if (sysctl(managementInformationBase, 2, &maximumBytesOfArgument, &size, NULL, 0) == -1) {
    Nan::ThrowTypeError("3. sysctl failed");
  }
}

NODE_MODULE(addon, Init)
