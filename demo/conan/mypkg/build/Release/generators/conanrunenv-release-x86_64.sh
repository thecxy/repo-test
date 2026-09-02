script_folder="/root/demo/conan/mypkg/build/Release/generators"
echo "echo Restoring environment" > "$script_folder/deactivate_conanrunenv-release-x86_64.sh"
for v in PATH
do
   is_defined="true"
   value=$(printenv $v) || is_defined="" || true
   if [ -n "$value" ] || [ -n "$is_defined" ]
   then
       echo export "$v='$value'" >> "$script_folder/deactivate_conanrunenv-release-x86_64.sh"
   else
       echo unset $v >> "$script_folder/deactivate_conanrunenv-release-x86_64.sh"
   fi
done

export PATH="/root/.conan2/p/b/hellocb0883541476b/p/bin:$PATH"